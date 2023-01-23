const lang = navigator.language.toLocaleLowerCase()
const isPolish = lang === 'pl' || lang === 'pl-pl'

const setUpManifest = (variant: string | null) => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'manifest')
    link.setAttribute('href', `manifest${variant ? ('-' + variant) : ''}.json`)
    document.head.appendChild(link)
}

const setPl = () => {
    document.documentElement.setAttribute('lang', 'pl')
    document.title = 'Kulki'
    document.querySelector('meta[name="description"]').setAttribute('content', "Odpocznij sobie i zagraj w Kulki")
    document.getElementById('title').textContent = 'Kulki'
    document.getElementById('score-prefix').textContent = 'Twój wynik to '
    document.getElementById('next-prefix').textContent = 'Kolejne kolory:'

    setUpManifest('pl')
}

export const init = () => {
    if (isPolish) setPl()
    else setUpManifest(null)
}

export const getLostText = (score: number) => {
    if (isPolish)
        return 'Koniec gry, twój wynik to ' + score

    return 'Game over, your score is ' + score
}
