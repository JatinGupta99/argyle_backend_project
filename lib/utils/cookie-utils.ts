/**
 * Cookie utility functions for managing browser cookies
 */

/**
 * Set a cookie with an optional expiration time
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 7)
 */
export function setCookie(name: string, value: string, days: number = 7): void {
    if (typeof window === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
        }
    }

    return null;
}

/**
 * Delete a cookie by name
 * @param name - Cookie name
 */
export function deleteCookie(name: string): void {
    if (typeof window === 'undefined') return;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Save the attendee token to a cookie
 * @param token - JWT token from the joining API
 */
export function setAttendeeTokenCookie(token: string): void {
    setCookie('attendee_token_details', token, 1); // Expires in 1 day
    console.log('[Cookie] Saved attendee token:', token.substring(0, 50) + '...');
}

/**
 * Retrieve the attendee token from cookie
 * @returns JWT token or null if not found
 */
export function getAttendeeTokenCookie(): string | null {
    const token = getCookie('attendee_token_details');
    if (token) {
        console.log('[Cookie] Retrieved attendee token from cookie');
    }
    return token;
}

/**
 * Delete the attendee token cookie
 */
export function deleteAttendeeTokenCookie(): void {
    deleteCookie('attendee_token_details');
    console.log('[Cookie] Deleted attendee token cookie');
}
