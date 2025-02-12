<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Illuminate\Pagination\LengthAwarePaginator\ response status data
     */
    public function index(Request $request)
    {
        if ($request->input('missedInstalled')) {
            $query = Game::where('priority', '<', 50);
            $query->where('priority', '>', -1);
            $query->where('tags', 'NOT LIKE', '%installed%');
            $games = $query->paginate(40);
            return $games;
        }
        if ($request->input('missedToInstall')) {
            $query = Game::where('priority', '<', 80);
            $query->where('priority', '>=', 50);
            $query->where('tags', 'NOT LIKE', '%to-install%');
            $games = $query->paginate(40);
            return $games;
        }
        if ($request->input('missedToDownload')) {
            $query = Game::where('priority', '<', 200);
            $query->where('priority', '>=', 80);
            $query->where('tags', 'NOT LIKE', '%to-download%');
            $games = $query->paginate(40);
            return $games;
        }

        if ($request->input('missedTried')) {
            $query = Game::where('priority', '<=', 300);
            $query->where('priority', '>=', 200);
            $query->where('tags', 'NOT LIKE', '%tried%');
            $query->where('tags', 'NOT LIKE', '%finished%');
            $query->where('tags', 'NOT LIKE', '%skip%');
            $games = $query->paginate(40);
            return $games;
        }
        if ($request->input('missedPriority')) {
            $query = Game::where('priority', '<=', -1);
            $query->where(function ($query) {
                $query->where('tags', 'LIKE', '%to-download%')
                    ->orWhere('tags', 'LIKE', '%to-install%')
                    ->orWhere('tags', 'LIKE', '%installed%');
            });
            $games = $query->paginate(40);
            return $games;
        }


        $pageSize = is_numeric($request->input('per_page'))
            ? $request->input('per_page')
            : 20;  // DEFAULT page size

        $searchTitle = '%' . $request->input('searchTitle') . '%';
        $searchTitle = $request->input('startsWith')
            ? $request->input('startsWith') . '%'
            : $searchTitle;
        $sizeMinParam = $request->input('sizeMin');
        $sizeMin = $sizeMinParam && is_numeric($sizeMinParam)
            ? $sizeMinParam
            : 0;
        $sizeMaxParam = $request->input('sizeMax');
        $sizeMax = $sizeMaxParam && is_numeric($sizeMaxParam)
            ? $sizeMaxParam
            : 1000;
        $searchTags = $request->input('tags') == "<untagged>"
            ? ""
            : '%' . $request->input('tags') . '%';
        $searchGenres = $request->input('genres') == "<untagged>"
            ? ""
            : '%' . $request->input('genres') . '%';

        $priorityParam = $request->input('priority');
        $priority = $priorityParam && is_numeric($priorityParam)
            ? $priorityParam
            : -2;
        $priorityOperand = $priorityParam && is_numeric($priorityParam)
            ? '='
            : '!=';

        $orderByParam = $request->input('orderBy');

        switch ($orderByParam) {
            case 'title':
                $orderByField = 'title';
                $orderByValue = 'ASC';
                break;
            case 'priority':
                $orderByField = 'priority';
                $orderByValue = 'ASC';
                $priorityOperand = '>=';
                break;
            case 'updated-at-asc':
                $orderByField = 'updated_at';
                $orderByValue = 'ASC';
                break;
            case 'fg_article_date':
                $orderByField = 'fg_article_date';
                $orderByValue = 'DESC';
                break;
            default:
                $orderByField = 'updated_at';
                $orderByValue = 'DESC';
        }

        $query = Game::where('title', 'LIKE', $searchTitle);
        if ($request->has('tags')) {
            $query->where('tags', 'LIKE', $searchTags);
        }

        if ($request->has('genres')) {
            $query->whereRaw('BINARY genre LIKE ?', [$searchGenres]);
            // $query->where('genre', 'LIKE', $searchGenres);
        }
        $query->where('size_calculated', '>=', $sizeMin);
        $query->where('size_calculated', '<=', $sizeMax);
        $query->where('priority', $priorityOperand, $priority);
        $query->orderBy($orderByField, $orderByValue);
        // echo $query->toSql();
        $games = $query->paginate($pageSize);
        return $games;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array response status data
     */
    public function store(Request $request)
    {
        // see https://stackoverflow.com/questions/44001030/laravel-validate-json-object
        $this->validate($request, [
            'title' => 'required',
        ]);

        $game = Game::create($request->all());
        return [
            "status" => 1,
            "data" => $game
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Game  $game
     * @return array response status data
     */
    public function show(Game $game)
    {
        return [
            "status" => 1,
            "data" => $game
        ];
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Game  $game
     * @return \Illuminate\Http\Response
     */
    public function edit(Game $game)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int $id Id of Game
     * @return array response status data
     */
    public function update(Request $request, int $id): array
    {
        $formData = json_decode($request->getContent());
        $game = Game::find($id);
        $game->priority = $formData->priority;
        $game->platform = $formData->platform;
        $game->status = $formData->status;
        $game->graphic_style = $formData->graphic_style;

        $game->tags = $formData->tags;
        $game->thoughts = $formData->thoughts;
        $game->playnite_title = $formData->playnite_title;

        $game->update();

        return [
            "status" => 1,
            "data" => $game,
            "msg" => "Game updated successfully"
        ];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Game  $game
     * @return array response status data
     */
    public function destroy(Game $game): array
    {
        $game->delete();
        return [
            "status" => 1,
            "data" => $game,
            "msg" => "Game deleted successfully"
        ];
    }

    /**
     * removeDuplicates
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array response status data
     */
    public function removeDuplicates(Request $request): array
    {
        $affected = DB::connection('mysql')->select('DELETE t1 FROM gc_games t1
        INNER JOIN gc_games t2
        WHERE
            t1.id > t2.id AND
            t1.fg_url = t2.fg_url;');
        return $affected;
    }

    /**
     * getGenres
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array response status data
     */
    public function getGenres(Request $request): string
    {
        $affected = DB::connection('mysql')->select('
        select distinct genre FROM gc_games;');
        // return $affected;
        $allItems = [];
        foreach ($affected as $row) {
            $allItems = array_merge($allItems, explode(", ", $row->genre));
        }

        // Step 2: Get unique items
        $uniqueItems = array_unique($allItems);

        // Filter out empty values (optional)
        $filteredArray = array_filter($uniqueItems, function ($value) {
            return !empty($value);
        });

        // Get only the values and re-index them
        $valuesArray = array_values($filteredArray);

        // Convert the result back to a JSON array of strings
        $jsonArrayOfStrings = json_encode($valuesArray, JSON_PRETTY_PRINT);

        return $jsonArrayOfStrings;
    }
    /**
     * getTags
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array response status data
     */
    public function getTags(Request $request): string
    {
        $affected = DB::connection('mysql')->select('
        select distinct tags FROM gc_games;');
        // return $affected;
        $allItems = [];
        foreach ($affected as $row) {
            $allItems = array_merge($allItems, explode(" ", $row->tags));
        }

        // Step 2: Get unique items
        $uniqueItems = array_unique($allItems);
        // Filter out empty values (optional)
        $filteredArray = array_filter($uniqueItems, function ($value) {
            return !empty($value);
        });

        // Get only the values and re-index them
        $valuesArray = array_values($filteredArray);

        // Convert the result back to a JSON array of strings
        $jsonArrayOfStrings = json_encode($valuesArray, JSON_PRETTY_PRINT);

        return $jsonArrayOfStrings;
    }
}
