document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')// het koppelen van het hele grid (alle divs) aan de js.
    let squares = Array.from(document.querySelectorAll('.grid div'))// het koppelen van elke div aan de js.
    const scoreDisplay = document.querySelector('#score')// het koppelen van de score display aan de js.
    const startBtn = document.querySelector('#start-button')// het koppelen van de start en pauze knop aan de js.
    const width = 10 // breedte
    let nextRandom = 0 // een random volgende blok geven.
    let timerId // nieuw blok geven
    let score = 0// zodat de score op 0 begint
    const colors = ['#98A1E7', '#AFE798', '#E25852', '#ECA639', '#E69EDE','#B788D4']// alle kleuren van de blokken.

    // The bloken
    const lblok = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const zblok = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]
    const tblok = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1,width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]
    const oblok = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]
    const iblok = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]


    const de_bloken = [lblok, zblok, tblok, oblok, iblok]

    let currentPosition = 4
    let currentRotation = 0

//Dit zorgt ervoor dat de blokjes random worden gekozen.
    let random = Math.floor(Math.random()*de_bloken.length)

    let current = de_bloken[random][currentRotation]

//het gevebn van een blok
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('blok')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('blok')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

//dit geeft aan met welke snelheid de blokjes naar beneden gaan.
timerId = setInterval(moveDown, 2000)

//De pijltijes op je keyboard koppelen aan het bewegen van het blok waar je op het moment mee speelt.
function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown()
    }

}
document.addEventListener('keyup', control)

//het iets sneller naar beneden laten gaan van het blok.
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

//Pauze knop functie
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //het geven van een nieuw blok om mee te spelen.
            random = nextRandom
            nextRandom = Math.floor(Math.random() * de_bloken.length)
            current = de_bloken[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

//Het naar links laten bewegen van het blok waar je mee speelt tot dat het de grand van het grid raakt.
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1
        }

        draw()
    }

//Het naar rechts laten bewegen van het blok waar je mee speelt tot dat het de grand van het grid raakt.
function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if(!isAtRightEdge) currentPosition +=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
    }

    draw()
}

//Het draaien van het blok waar je ee speeld.
function rotate()   {
    undraw()
    currentRotation++
    if(currentRotation === current.length) {
        currentRotation = 0
    }
    current = de_bloken[random][currentRotation]
}

//Het volgende blok laten zien in het mini grid

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

// Opkomt blokken veranderen naar random.
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lblok
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zblok
    [1, displayWidth, displayWidth+1, displayWidth+2], //tblok
    [0, 1, displayWidth, displayWidth+1], //oblok
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iblok
]

//Het laten zien van het opkomende blok.
function displayShape() {
    //Er voor zorgen dat het blokje weg gaat uit het mini grid zodat er een ander blokje kan komen.
    displaySquares.forEach(square => {
        square.classList.remove('blok')
        square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('blok')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//Er voor zorgen dat de start en pauze knop ook echt op start en pauze kan gaan.
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = 0
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*de_bloken.length)
        displayShape()
    }
})
//zorgen dat je punten kan scoren en het het ook op de display opteld.
function addScore() {
    for (let i=0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 55
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('blok')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }

}
// Game over functie. Deze functie zie je als je af gaat, dus als je met een blokje de bovenkant aanraakt.
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'einde, reload de pagina om het spel opnieuw te spelen.'
        clearInterval(timerId)
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(grid))
        freeze()
    }
    gameover()
}

})
