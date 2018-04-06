<?php

namespace Api;
include_once 'MoveInterface.php';


/**
 * Class Move
 * @package Api
 */
class Move implements MoveInterface
{
    /**
     * @var array
     */
    private $winning_possibilities = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];

    /**
     * @var array
     */
    private $X = [];
    /**
     * @var array
     */
    private $O = [];
    /**
     * @var array
     */
    private $boardState = [];
    /**
     * @var array
     */
    private $emptyCells = [];


    /**
     * Makes a move using the $boardState
     * $boardState contains 2 dimensional array of the game field
     * X represents one team, O - the other team, empty string means field is not yet taken.
     * example
     * [['X', 'O', '']
     * ['X', 'O', 'O']
     * ['', '', '']]
     * Returns an array, containing x and y coordinates for next move, and the unit that now occupies it.
     * Example: [2, 0, 'O'] - upper right corner - O player
     *
     * @param array $boardState Current board state
     * @param string $playerUnit Player unit representation
     *
     * @return array
     */
    public function makeMove($boardState, $playerUnit = 'X')
    {
        $AIPlayer = 'O';
        if ($playerUnit == 'O') {
            $AIPlayer = 'X';
        }

        $this->boardState = $boardState;
        $this->emptyCells = $this->getEmptyCells($boardState);

        $this->setPlayerCells();

        $bestMove = $this->getBestMove($this->emptyCells, $AIPlayer);

        if (!$bestMove) {
            $bestMove = $this->getBestMove($this->emptyCells, $playerUnit);
        }

        if (!$bestMove) {
            $bestMove = $this->emptyCells[rand(0, count($this->emptyCells) - 1)];
        }

        $move = explode(',', $bestMove);

        $result = [$move[1], $move[0], $AIPlayer];

        return $result;
    }

    /**
     * Loop on all board to find all empty cells
     * @param $boardState
     * @return array
     */
    function getEmptyCells($boardState)
    {
        $emptyCells = [];
        foreach ($boardState as $rowIndex => $row) {
            foreach ($row as $colIndex => $cell) {
                if (empty($cell)) {
                    $emptyCells[] = $rowIndex . ',' . $colIndex;
                }
            }
        }
        return $emptyCells;
    }

    /**
     * Find the winning cell for a player based on the winning possibilities
     * loop on all empty cells and check if player win with any move
     * @param $avalibleCells
     * @param $player
     * @return bool
     */
    function getBestMove($avalibleCells, $player)
    {
        $move = false;
        $playerCells = array_flip($this->$player);
        foreach ($avalibleCells as $cell) {

            $playerCells[$cell] = count($playerCells);

            if ($this->playerWins($playerCells)) {
                $move = $cell;
                break;
            }
            unset($playerCells[$cell]);
        }

        return $move;
    }

    /**
     * Loop on all winning patterns
     * If any pattern complete, player wins
     * @param $playerCells
     * @return bool
     */
    function playerWins($playerCells)
    {
        $win = false;
        foreach ($this->winning_possibilities as $row) {
            $first = $row[0][0] . ',' . $row[0][1];
            $second = $row[1][0] . ',' . $row[1][1];
            $third = $row[2][0] . ',' . $row[2][1];
            if (isset($playerCells[$first]) and isset($playerCells[$second]) and isset($playerCells[$third])) {
                $win = true;
                break;
            }
        }
        return $win;
    }

    /**
     * Set the "O" or "X" filled cells
     */
    function setPlayerCells()
    {
        foreach ($this->boardState as $rowIndex => $row) {
            foreach ($row as $colIndex => $cell) {
                if (!empty($cell)) {
                    array_push($this->$cell, $rowIndex . ',' . $colIndex);
                }
            }
        }
    }

}
