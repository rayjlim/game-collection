<?php

namespace App\Utility;

class FgParser
{
    public $articles = [];
    public $dom = null;

    function parse(String $html){
        $this->dom = new \DomDocument();
        @ $this->dom->loadHTML($html);
        $articles = $this->dom->getElementsByTagName('article');
        $result = [];

        foreach($articles as $article){
            $classname="cat-links";
            $nodes = $this->byClass($article, 'span', $classname);
            $parsed = $nodes[0]->textContent;
            if ($parsed == 'Lossless Repack') {
                array_push($result, $article);
            }
        }
        $this->articles = $result;
    }

    function getInfo(int $index){
        $dom = $this->articles[$index];
        $nodes = $this->byClass($dom, "span", "cat-links");
        $parsed = $nodes[0]->textContent;

        $game = new \App\Models\Game();
        $game->category = $parsed;

        $entryNode = $this->byClass($dom, "div", "entry-content");
        $h3Nodes = $entryNode[0]->getElementsByTagName("h3");
        $fgIdNodes = $h3Nodes[0]->getElementsByTagName("span");
        $parsed = substr($fgIdNodes[0]->textContent, 1);

        $game->fgId = $parsed;

        $titleNodes = $h3Nodes[0]->getElementsByTagName("strong");
        $parsed = $titleNodes[0]->textContent;
        $game->title = $parsed;

        $entryNode = $this->byClass($dom, "div", "entry-content");
        $pNodes = $entryNode[0]->getElementsByTagName("p");
        $strongNodes = $pNodes[0]->getElementsByTagName("strong");
        $game->genre = $strongNodes[0]->textContent;

        $game->size = $strongNodes[count($strongNodes)-1]->textContent;

        $imgNodes = $pNodes[0]->getElementsByTagName("img");

        // $game->image = $this->dom->saveXML($imgNodes[0]);

        $game->image = $imgNodes[0]->getAttribute('src');

        // $game->image
        // $game->fg_article_date
        // $game->fg_url

        // $game->fg_summary

        return $game;
    }


    private function byClass(\DOMElement $a,$b,$c){
        $r = [];
        foreach($a->getElementsByTagName($b) as $e){
            if($e->getAttribute('class')==$c){$r[]=$e;}
        }
        return $r;
    }
}