import '../styles/globals.css'
import '../styles/styles.css'
import localFont from 'next/font/local'
import { ThemeProvider } from '../components/theme/ThemeProvider'

const geistSans = localFont({
    src: '../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2',
    variable: '--font-geist-sans',
    display: 'swap',
})

const geistMono = localFont({
    src: '../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2',
    variable: '--font-geist-mono',
    display: 'swap',
})

export default function MyApp({ Component, pageProps }) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        </div>
    )
}
