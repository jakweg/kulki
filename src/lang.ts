const setPl = () => {
    document.title = 'Kulki'
    document.querySelector('meta[name="description"]').setAttribute('content', "Odpocznij sobie i zagraj w Kulki")
    document.getElementById('title').textContent = 'Kulki'
    document.getElementById('score-prefix').textContent = 'Twój wynik to '
    document.getElementById('next-prefix').textContent = 'Kolejne kolory:'
}

export const init = () => {
    if (navigator.language === 'pl') setPl()
}

export const getLostText = (score: number) => {
    if (navigator.language === 'pl')
        return 'Koniec gry, twój wynik to ' + score

    return 'Game over, your score is ' + score
}