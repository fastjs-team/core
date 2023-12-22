export interface parseReturn {
    /** @description format string */
    format: string
    /** @description Date object */
    date: Date
    /** @description string of Date */
    string: string
    /** @description string of Date, same as string */
    dateString: string
    /** @description timestamp of Date */
    timestamp: number
    /** @description Date object of UTC */
    utcDate: Date
    /** @description timestamp of UTC */
    utcTimestamp: number
    /** @description string of UTC */
    utcDateString: string
}

export interface fDate {
    // timestamp: number
    t: number
    // timezone: number
    z: number
    // utc: boolean
    u: boolean
}