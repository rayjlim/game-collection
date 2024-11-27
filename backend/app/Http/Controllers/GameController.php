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
        $pageSize = is_numeric($request->input('per_page'))
            ? $request->input('per_page')
            : 20;  // DEFAULT page size

        $searchTitle = '%' . $request->input('search_title') . '%';
        $searchTitle = $request->input('starts_with')
            ? $request->input('starts_with') . '%'
            : $searchTitle;
        $sizeMinParam = $request->input('size_min');
        $sizeMin = $sizeMinParam && is_numeric($sizeMinParam)
            ? $sizeMinParam
            : 0;
        $sizeMaxParam = $request->input('size_max');
        $sizeMax = $sizeMaxParam && is_numeric($sizeMaxParam)
            ? $sizeMaxParam
            : 1000;
        $searchTags = $request->input('tags') == "<untagged>"
            ? ""
            : '%' . $request->input('tags') . '%';
        $priorityParam = $request->input('priority');
        $priority = $priorityParam && is_numeric($priorityParam)
            ? $priorityParam
            : -2;
        $priorityOperand = $priorityParam && is_numeric($priorityParam)
            ? '='
            : '!=';

        $orderByParam = $request->input('order_by');

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

        $games = Game::where('title', 'LIKE', $searchTitle)
            ->where('tags', 'LIKE', $searchTags)
            ->where('size_calculated', '>=', $sizeMin)
            ->where('size_calculated', '<=', $sizeMax)
            ->where('priority', $priorityOperand, $priority)
            ->orderBy($orderByField, $orderByValue)
            ->paginate($pageSize);

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
}
