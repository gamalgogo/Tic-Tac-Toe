<?php

/**
 * Include App Classes
 */

require_once 'src/Move.php';
use Api\Move;

require_once __DIR__ . '/../vendor/autoload.php';

/**
 * Class simpleTest
 */
final class simpleTest extends \PHPUnit_Framework_TestCase
{
    /**
     * testIsValidJourne Method
     */
    public function testIsValidOutput()
    {
        $board=[
            ['X', '', ''],
            ['', 'X', ''],
            ['O', '', '']
        ];

        $move = new Move();
        $this->assertSameSize([2,0,'X'], $move->makeMove($board,'X'));
    }

}



