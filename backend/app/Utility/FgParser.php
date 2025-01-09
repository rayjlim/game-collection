<?php

namespace App\Utility;

class FgParser
{
    public $articles = [];
    public $dom = null;

    function parse(String $html)
    {
        $this->dom = new \DomDocument();
        @$this->dom->loadHTML($html);
        $articles = $this->dom->getElementsByTagName('article');
        $result = [];

        foreach ($articles as $article) {
            $classname = "cat-links";
            $nodes = $this->byClass($article, 'span', $classname);
            $parsed = $nodes[0]->textContent;
            if (str_contains($parsed, 'Repack')) {
                array_push($result, $article);
            }
        }
        $this->articles = $result;
    }

    function getInfo(int $index)
    {
        $dom = $this->articles[$index];
        $nodes = $this->byClass($dom, "span", "cat-links");
        $parsed = $nodes[0]->textContent;

        $game = new \App\Models\Game();
        $game->category = $parsed;

        $entryNode = $this->byClass($dom, "div", "entry-content");
        $h3Nodes = $entryNode[0]->getElementsByTagName("h3");
        if (count($h3Nodes) === 0) {
            return null;
        }
        $fgIdNodes = $h3Nodes[0]->getElementsByTagName("span");
        $parsed = substr($fgIdNodes[0]->textContent, 1); // skip # at begining
        $parsed = preg_replace('/[\D]+/', '', $parsed);

        $game->fg_id = is_numeric($parsed) ? $parsed : -1;

        // Get the next sibling node
$nextSibling = $fgIdNodes[0]->nextSibling;
// Loop through the siblings to find the next element (skip text nodes)
while ($nextSibling && $nextSibling->nodeType != XML_ELEMENT_NODE) {
    $nextSibling = $nextSibling->nextSibling;
}


        if ($nextSibling && $nextSibling->nodeName === 'span') {
            // echo 'The next sibling is a <span> element.';
            $parsed = $nextSibling->textContent;
            $game->title = trim($parsed);
        } else {
            // echo 'The next sibling is not a <span> element.';
            $titleNodes = $h3Nodes[0]->getElementsByTagName("strong");
            $parsed = $titleNodes[0]->textContent;
            $game->title = $parsed;
        }



        $entryNode = $this->byClass($dom, "div", "entry-content");
        $pNodes = $entryNode[0]->getElementsByTagName("p");
        $strongNodes = $pNodes[0]->getElementsByTagName("strong");
        if (strpos($pNodes[0]->textContent, "Genres")) {
            $game->genre = $strongNodes[0]->textContent;
        }

        $game->size = $strongNodes[count($strongNodes) - 1]->textContent;

        $imgNodes = $pNodes[0]->getElementsByTagName("img");

        // $game->image = $this->dom->saveXML($imgNodes[0]);

        $game->image = $imgNodes[0]->getAttribute("src");

        $entryDateNodes = $this->byClass($dom, "span", "entry-date");
        $timestamp = strtotime(str_replace('/', '-', $entryDateNodes[0]->textContent)); // Replacing '/' with '-' for strtotime compatibility
        $sql_date = date('Y-m-d', $timestamp); // Format the date as 'YYYY-MM-DD' which is SQL compatible
        $game->fg_article_date = $sql_date;

        $game->fg_url = $entryDateNodes[0]->getElementsByTagName("a")[0]->getattribute("href");

        return $game;
    }

    public static function convertSizeString(string $target)
    {

        $parsed = str_ireplace("from", "", $target);
        $output = str_ireplace("fom", "", $parsed);
        $output = str_ireplace("selective download", "", $output);
        $output = str_ireplace(",", ".", $output);
        $output = str_ireplace("[", "", $output);
        $output = str_ireplace("]", "", $output);
        $output = str_ireplace("(", "", $output);
        $output = str_ireplace(")", "", $output);
        $multiplier = 1;
        if (stripos($output, 'mb')) {
            $multiplier = .001;
        }
        $output = str_ireplace("MB", "", $output);
        $output = str_ireplace("GB", "", $output);
        $output = trim($output);
        $output = explode('\\', $output)[0];
        $output = explode('/', $output)[0];
        $output = explode('~', $output)[0];
        $output = explode('o', $output)[0];

        $output = trim($output);
        return is_numeric($output) ? $output * $multiplier : 0;
    }

    private function byClass(\DOMElement $a, $b, $c)
    {
        $r = [];
        foreach ($a->getElementsByTagName($b) as $e) {
            if ($e->getAttribute('class') == $c) {
                $r[] = $e;
            }
        }
        return $r;
    }
}
