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
        $rawTitle = substr($fgIdNodes[0]->textContent, 1); // skip # at begining
        $rawTitle = preg_replace('/[\D]+/', '', $rawTitle);

        $game->fg_id = is_numeric($rawTitle) ? $rawTitle : -1;

        // Get the next sibling node
        $nextSibling = $fgIdNodes[0]->nextSibling;
        // Loop through the siblings to find the next element (skip text nodes)
        while ($nextSibling && $nextSibling->nodeType != XML_ELEMENT_NODE) {
            $nextSibling = $nextSibling->nextSibling;
        }

        if ($nextSibling && $nextSibling->nodeName === 'span') {
            // echo 'The next sibling is a <span> element.';
            $rawTitle = $nextSibling->textContent;
        } else {
            // echo 'The next sibling is not a <span> element.';
            $titleNodes = $h3Nodes[0]->getElementsByTagName("strong");
            $rawTitle = $titleNodes[0]->textContent;
        }
        $game->title = trim($rawTitle);

        $entryNode = $this->byClass($dom, "div", "entry-content");
        $pNodes = $entryNode[0]->getElementsByTagName("p");

        // Find the text between the first and second <br> tags for genres
        $pHtml = $this->dom->saveHTML($pNodes[0]);
        $matches = [];
        if (preg_match_all('/<br\s*\/?>/i', $pHtml, $brMatches, PREG_OFFSET_CAPTURE)) {
            if (count($brMatches[0]) >= 2) {
                $start = $brMatches[0][0][1] + strlen($brMatches[0][0][0]);
                $end = $brMatches[0][1][1];
                $genreHtml = substr($pHtml, $start, $end - $start);
                // Remove "Genres/Tags:" prefix if present
                $genreHtml = preg_replace('/^.*?Genres\/Tags:\s*/i', '', $genreHtml);
                // Remove all HTML tags except <a>
                $genreHtml = strip_tags($genreHtml, '<a>');
                // Extract the text content of each <a> tag
                $genreDom = new \DOMDocument();
                @$genreDom->loadHTML('<div>' . $genreHtml . '</div>');
                $genreLinks = $genreDom->getElementsByTagName('a');
                $genres = [];
                foreach ($genreLinks as $link) {
                    $genres[] = trim($link->textContent);
                }
                $game->genre = implode(', ', $genres);
            } else {
                $game->genre = '';
            }
        } else {
            $game->genre = '';
        }
        $strongNodes = $pNodes[0]->getElementsByTagName("strong");
        // if (strpos($pNodes[0]->textContent, "Genres")) {
        //     $game->genre = $strongNodes[0]->textContent;
        // }

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
