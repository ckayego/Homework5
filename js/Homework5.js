/*
File: homework5.js
GUI Assignment 5: To implement a bit of the game of Scrabble using drag-and-drop.
Christian Kayego, UMass Lowell Computer Science, christian_kayego@student.uml.edu
In this assignment, the goal is to implement a bit of the game of Scrabble using drag-and-drop. 
The idea is to display one line of the Scrabble board to the user along with seven 
letter tiles on a tile rack. The user then drags tiles to the board to make a word, 
and you are to report his or her score, taking the letter values and bonus squares 
into consideration. 
Copyright (c) 2023 by Christian Kayego. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by Christian Kayego on June 25, 2023 at 10:00 am
Sources used: https://www.w3schools.com/, https://www.youtube.com/watch?v=UB1O30fR-EE, https://stackoverflow.com/
jQueryUI1.8_Ch06_SliderWidget.pdf, jQueryUI1.8_Ch03_TabsWidget.pdf
https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css --
https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js -
*/

/* Used Professor Heines array */
var ScrabbleTiles = [];
ScrabbleTiles[0] = {"letter": "A", "value": 1, "original_distribution": 9, "number_remaining": 9};
ScrabbleTiles[1] = {"letter": "B", "value": 3, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[2] = {"letter": "C", "value": 3, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[3] = {"letter": "D", "value": 2, "original_distribution": 4, "number_remaining": 4};
ScrabbleTiles[4] = {"letter": "E", "value": 1, "original_distribution": 12, "number_remaining": 12};
ScrabbleTiles[5] = {"letter": "F", "value": 4, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[6] = {"letter": "G", "value": 2, "original_distribution": 3, "number_remaining": 3};
ScrabbleTiles[7] = {"letter": "H", "value": 4, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[8] = {"letter": "I", "value": 1, "original_distribution": 9, "number_remaining": 9};
ScrabbleTiles[9] = {"letter": "J", "value": 8, "original_distribution": 1, "number_remaining": 1};
ScrabbleTiles[10] = {"letter": "K", "value": 5, "original_distribution": 1, "number_remaining": 1};
ScrabbleTiles[11] = {"letter": "L", "value": 1, "original_distribution": 4, "number_remaining": 4};
ScrabbleTiles[12] = {"letter": "M", "value": 3, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[13] = {"letter": "N", "value": 1, "original_distribution": 6, "number_remaining": 6};
ScrabbleTiles[14] = {"letter": "O", "value": 1, "original_distribution": 8, "number_remaining": 8};
ScrabbleTiles[15] = {"letter": "P", "value": 3, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[16] = {"letter": "Q", "value": 10, "original_distribution": 1, "number_remaining": 1};
ScrabbleTiles[17] = {"letter": "R", "value": 1, "original_distribution": 6, "number_remaining": 6};
ScrabbleTiles[18] = {"letter": "S", "value": 1, "original_distribution": 4, "number_remaining": 4};
ScrabbleTiles[19] = {"letter": "T", "value": 1, "original_distribution": 6, "number_remaining": 6};
ScrabbleTiles[20] = {"letter": "U", "value": 1, "original_distribution": 4, "number_remaining": 4};
ScrabbleTiles[21] = {"letter": "V", "value": 4, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[22] = {"letter": "W", "value": 4, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[23] = {"letter": "X", "value": 8, "original_distribution": 1, "number_remaining": 1};
ScrabbleTiles[24] = {"letter": "Y", "value": 4, "original_distribution": 2, "number_remaining": 2};
ScrabbleTiles[25] = {"letter": "Z", "value": 10, "original_distribution": 1, "number_remaining": 1};
ScrabbleTiles[26] = {"letter": "_", "value": 0, "original_distribution": 2, "number_remaining": 2};


$(document).ready(function () {
    generateTiles();
    generateBoard();
    toDragAndDrop();
}); 

/*Global Variables*/
var tiles = "";
var table = "";
var score = 0;
var board = [];
var values = []; 
var letters_placed = [];
var display_letters = "";


function toDragAndDrop() {
    for (var i = 0; i < 7; i++) {
        $("#tile-drag_" + i).draggable({
            cursorAt: {//centers the mouse on the tile to drag
             top: 60,
             left: 130
             }
        }); 
    } 

    $(".drop-here").droppable({
        hoverClass: 'active',
        
        drop: function (event, ui) {
            $(this).droppable('option', 'accept', ui.draggable);
            $(this).append(ui.draggable);

            var id = ui.draggable.attr("id"); //id of object being dragged is accessed

            var dropped = ui.draggable;
            var droppedOn = $(this);
            $(dropped).detach().css({top: 0, left: 0}).appendTo(droppedOn);

            if ($(this).hasClass('drop-here')) {
                var last_digit = id.substr(id.length - 1); //Acccesses number associated to value of the letter
                if ($(this).hasClass('double_letter') || $(this).hasClass('double_word')) {
                    score += values[last_digit][1];
                }
                if ($(this).hasClass('triple_letter') || $(this).hasClass('triple_word'))
                {
                    var timesThree = values[last_digit][1] * 2;
                    score += timesThree;
                }
                score += values[last_digit][1]; //Obtains value of letter and adds it to the score
                display_letters += letters_placed[last_digit][1]; //tiles that have been placed on the board are displayed
                $('#letters').html(display_letters); 
                $('#score').html(score); 
            }

        },
        out: function (event, ui) {
            $(this).droppable('option', 'accept', '.drag-item');
        }
    });   
} 

function generateTiles() {
    var rack = $("#rack");
  
    // Clear the tile holder
    rack.empty();
  
    // Generate 7 random tile letters
    for (var i = 0; i < 7; i++) {
      var randomIndex = Math.floor(Math.random() * ScrabbleTiles.length); // Generate a random index
      var tile = ScrabbleTiles[randomIndex]; // Get the tile object from the ScrabbleTiles array
  
      // Decrease the number of remaining tiles for the selected letter
      tile.number_remaining--;
  
      // Create a new tile element
      var tileElement = $("<div>")
        .addClass("tile")
        .text(tile.letter)
        .attr("id", "tile-drag_" + i);
  
      // Append the tile element to the tile holder
      rack.append(tileElement);
  
      // Update the letters_placed and values arrays for later use
      letters_placed[i] = [tile.letter, tile.value];
      values[i] = [tile.letter, tile.value];
  
      // If there are no more tiles remaining for the selected letter, remove it from the ScrabbleTiles array
      if (tile.number_remaining === 0) {
        ScrabbleTiles.splice(randomIndex, 1);
      }
    }
  }
  

//function to generate the scrabble board
function generateBoard() {
    table += '<table>'; //start of table
    
    scrabbleRow1();
    scrabbleRow2();
    scrabbleRow3();
    scrabbleRow4();
    scrabbleRow5();
    scrabbleRow6();
    scrabbleRow7();
    scrabbleRow8();
    scrabbleRow7();
    scrabbleRow6();
    scrabbleRow5();
    scrabbleRow4();
    scrabbleRow3();
    scrabbleRow2();
    scrabbleRow1();
    table += '</table>'; 
    $('#scrabble-board').html(table); 
}

//each row of the scrabble board from 1-8
function scrabbleRow1() {
    table += '<tr>';
    table += '<td class="triple_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_word drop-here"></td>';
}

function scrabbleRow2() {
    table += '<tr>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
}

function scrabbleRow3() {
    table += '<tr>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
}

function scrabbleRow4() {
    table += '<tr>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
}

function scrabbleRow5() {
    table += '<tr>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
}

function scrabbleRow6() {
    table += '<tr>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
}

function scrabbleRow7() {
    table += '<tr>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
}

function scrabbleRow8() {
    table += '<tr>';
    table += '<td class="triple_word drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="star drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="double_letter drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="drop-here"></td>';
    table += '<td class="triple_word drop-here"></td>';
}
