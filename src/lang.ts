const lang = navigator.language.toLocaleLowerCase()
const isPolish = lang === 'pl' || lang === 'pl-pl'

const setUpManifest = (variant: string) => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'manifest')
    link.setAttribute('href', `manifest-${variant || 'en'}.json`)
    document.head.appendChild(link)
}

const setEnglishLanguage = () => {
    document.documentElement.setAttribute('lang', 'en')
    document.title = 'Color lines'
    document.querySelector('meta[name="description"]').setAttribute('content', "Relax and play Color lines!")
    document.getElementById('title').textContent = 'Color lines'
    document.getElementById('score-prefix').textContent = 'Your score is '
    document.getElementById('next-prefix').textContent = 'Next colors:'

    setUpManifest('en')
}

export const init = () => {
    if (isPolish) setUpManifest('pl')
    else setEnglishLanguage()
}

export const getLostText = (score: number) => {
    if (isPolish)
        return 'Koniec gry, twój wynik to ' + score

    return 'Game over, your score is ' + score
}
