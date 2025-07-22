<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Utility\FgParser;
use Illuminate\Http\Request;
use Carbon\Carbon;

use Log;

class ParserController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Log::info('parser called ');
        $this->validate($request, [
            'source' => 'required',
            'fg_url' => 'required'
        ]);

        $parser = new FgParser();
        $fg_url = $request->input('fg_url');
        Log::info('source for: ' . $fg_url);
        $source = $request->input('source');
        $parser->parse($source);
        $games = [];
        for ($i = 0; $i < count($parser->articles); $i++) {
            $found = $parser->getInfo($i);
            if ($found) {
                Log::info('game: ' . json_encode($found->title));
                $games[] = $found;
            }
        }

        foreach ($games as $parsed) {
            $game = Game::where('fg_url', $parsed->fg_url)->first();

            if (is_null($game)) {
                Log::info('NEW GAME ' . $parsed->title);
                $game = new Game;
                $game->fg_id = $parsed->fg_id;
                $game->title = $parsed->title;
                $game->genre = $parsed->genre;
                $game->size = $parsed->size;
                $game->size_calculated = FgParser::convertSizeString($parsed->size);
                $game->image = $parsed->image;
                $game->fg_url = $parsed->fg_url;
                $time = strtotime($parsed->fg_article_date);
                $game->fg_article_date = date('Y-m-d', $time);
                $game->platform = 1;
                $game->tags = '';

                $game->save();
            } else {
                Log::info('Updating Existing ' . $parsed->title);
                $game->fg_id = $parsed->fg_id;
                $game->title = $parsed->title;
                $game->genre = $parsed->genre;
                $game->size = $parsed->size;
                $game->size_calculated = FgParser::convertSizeString($parsed->size);
                $game->image = $parsed->image;
                $parsed_article_time = strtotime($parsed->fg_article_date);
                $original_time = strtotime($game->fg_article_date);
                $game->fg_article_date = date('Y-m-d', $parsed_article_time);

                if ($parsed_article_time >= $original_time) {
                    Log::info('====------Saved-----=====');
                    $game->save();
                } else {
                    Log::info('Not Saved ' . $game->fg_article_date);
                }
            }
        }

        return [
            "status" => 1,
            "data" => $games
        ];
    }

    function htmlTableToCsv($html)
    {
        // Create a new DOMDocument
        $dom = new \DOMDocument();

        // Load HTML content
        $dom->loadHTML($html);

        // Find all tables in the HTML
        $tables = $dom->getElementsByTagName('table');

        $csv = '';

        // Iterate through each table
        foreach ($tables as $table) {
            // Iterate through each row of the table
            foreach ($table->getElementsByTagName('tr') as $row) {
                $rowData = array();
                // Iterate through each cell in the row
                foreach ($row->getElementsByTagName('td') as $cell) {
                    // Clean cell text (remove HTML tags and trim whitespace)
                    $rowData[] = trim(strip_tags($cell->nodeValue));
                }
                // Convert row data to CSV format
                $csv .= implode(',', $rowData) . "\n";
            }
        }

        return $csv;
    }

    public function playnite(Request $request)
    {
        $formData = json_decode($request->getContent());
        $html = $formData->pnHtml;

        $html = str_replace('h2jscript', '', $html);
        $html = str_replace('’', '\'', $html);
        $html = str_replace('‘', '\'', $html);

        // Parse HTML table and convert it to CSV
        $csvData = $this->htmlTableToCsv($html);

        $data = '';
        // Output CSV data
        // $data = $data.$csvData;
        // Parse the CSV string into an array of rows
        $rows = explode("\n", $csvData);
        $unfound = [];
        // Iterate over each row
        foreach ($rows as $row) {
            // Parse the row into an array of fields
            $fields = str_getcsv($row);

            if (count($fields) > 2) {
                // foreach ($fields as $field) {
                //     $data = $data. $field . ", "; // Example: output each field followed by a comma
                // }
                $title_index = 2;
                $fieldName = $fields[$title_index];
                // $data = $data. "Using ".$fieldName." to search. ";
                $game = Game::where('playnite_title', $fieldName)->first();
                if (is_null($game)) {
                    // $data = $data.$fieldName . ' is not found, ';
                    $titleMatches = Game::where('title', 'LIKE', "%{$fieldName}%")->get();
                    if (is_null($titleMatches) || count($titleMatches) == 0) {
                        $data = $data . $fieldName . ' title match also not found';
                        $data = $data . "\n\n";
                        $unfound[] = $fieldName;
                        Log::info('===No Title match found ' . $fieldName);
                    } else if (count($titleMatches) > 1) {
                        $data = $data . $fieldName . ' more than 1 title found';
                        $data = $data . "\n\n";
                        $unfound[] = $fieldName;
                        Log::info('===Multiple Title match found ' . $fieldName);
                    } else {
                        Log::info('Updating Missing ' . $fieldName . count($titleMatches));
                        $titleMatches[0]->playnite_title = $fieldName;
                        $titleMatches[0]->playnite_last = $fields[$title_index + 2];
                        $titleMatches[0]->playnite_added = $fields[$title_index + 3];
                        $titleMatches[0]->playnite_playtime = $fields[$title_index + 4];
                        $titleMatches[0]->playnite_checktime = Carbon::now();
                        $titleMatches[0]->save();
                    }
                } else {
                    // Log::info('Updating Existing ' . $fieldName);
                    $game->playnite_last = $fields[$title_index + 2];
                    $game->playnite_added = $fields[$title_index + 3];
                    $game->playnite_playtime = $fields[$title_index + 4];
                    $game->playnite_checktime = Carbon::now();
                    // Log::info('====------Saved-----=====');
                    $game->save();
                }

                // $data = $data. $field . "\n\n";
            }
        }

        // Search has playnite_title but check date not updated.
        // For each, remove playnite title, set priority to 200,log the change
        $scriptTimeAgo = Carbon::now()->subSeconds(5);
        Log::info('oneMinuteAgo ' . $scriptTimeAgo);
        $removed = Game::where('playnite_title', 'not LIKE', "")
            ->where('playnite_checktime', '<=', $scriptTimeAgo)
            ->get();

        // Loop over if has title but last checked not today if has playnite_title, but not in HTML then ask if deleted?
        foreach ($removed as $game){
            $game->playnite_title = '';
            $game->priority = 201;

            // Log::info('====------Saved-----=====');
            $game->save();
            Log::info('Removed from Playnite ' . $game->title);
        }


        return [
            "data" => $unfound,
            "removed" => $removed

        ];
    }
}
