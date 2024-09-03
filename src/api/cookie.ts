export interface CookieProps {
  token: string
  exp: number
}

export const cookieSet = ({ token, exp }: CookieProps): void => {
  document.cookie = `vue_work=${token};expires=${exp}`
}

export const cookieGet = (): string =>
  document.cookie.replace(/(?:(?:^|.*;\s*)vue_work\s*=\s*([^;]*).*$)|^.*$/, '$1')

export const cookieDel = (): void => {
  document.cookie = 'vue_work='
}
