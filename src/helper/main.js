import { DateTime } from 'luxon'

export const unique = (arr, value) => [...new Set(arr.map(o => o[value]))]

export function filterToCurrentData(initData) {
    initData.forEach(r => r.updated = DateTime.fromISO(r.updated))
    const maxDate = DateTime.max(...initData.map(row => row.updated))
    return initData.filter(({ updated }) => updated.equals(maxDate))
}

export function parseData(d) {
    d.forEach((row, i) => row.id = i)
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const libs = unique(d, 'library')
    const res = []
    for (const lib of libs) {
        const curr = d.filter(o => o.library === lib)
        const row = { library: lib }
        for (const day of weekdays) {
            const hours = curr.filter(o => o.day === day)
            row[day] = hours.map(({ start, finish, opening_type, id }) => ({ start, finish, opening_type, id }))
        }
        res.push(row)
    }
    return res
}

export const dayLookup = (s) =>
    [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ].filter((d) => d.slice(0, 3) === s)[0];

export function timePos(el) {
    const tablePos = document
        .querySelector("table")
        .getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const top = rect.top - tablePos.top;
    const left = rect.left - tablePos.left + rect.width / 2;
    const translateY =
        top < window.innerHeight / 2
            ? `${rect.height + 10}px`
            : "-100%";
    return { top, left, translateY }
}
