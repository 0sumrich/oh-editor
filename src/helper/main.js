import { DateTime } from 'luxon'

export const unique = (arr, value) => [...new Set(arr.map(o => o[value]))]

export function filterToCurrentData(initData) {
    initData.forEach(r => r.updated = DateTime.fromISO(r.updated))
    const maxDate = DateTime.max(...initData.map(row => row.updated))
    return initData.filter(({ updated }) => updated.equals(maxDate))
}

export const getHoursFromString = s => {
    const [h, m] = s.split(':').map(d => +d)
    return h + (m / 60)
}

export function parseData(d) {
    d.forEach((row, i) => row.id = i)
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const libs = unique(d, 'library')
    const res = []
    for (const lib of libs) {
        const curr = d.filter(o => o.library === lib)
        const row = { library: lib }
        let totalHoursForTheWeek = {}
        for (const day of weekdays) {
            const hours = curr.filter(o => o.day === day)
            row[day] = hours.map(({ start, finish, opening_type, id }) => ({ start, finish, opening_type, id }))
            hours.forEach(hour => {
                const { opening_type, start, finish } = hour
                const total = getHoursFromString(finish) - getHoursFromString(start)
                if (!totalHoursForTheWeek.hasOwnProperty(opening_type)) {
                    totalHoursForTheWeek[opening_type] = total
                } else {
                    totalHoursForTheWeek[opening_type] += total
                }
            })
        }
        row.total = totalHoursForTheWeek
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

export function dataIsEqual(a, b) {
    const jsonA = JSON.stringify(a);
    const jsonB = JSON.stringify(b);
    return jsonA === jsonB;
}

export async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //   credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        //   referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export function calculateTotal(row) {
    const weekdays = Object.keys(row).filter(
        (key) => !["library", "total"].includes(key)
    );
    let total = {};
    for (const day of weekdays) {
        for (const { start, finish, opening_type } of row[day]) {
            const dayTotal =
                getHoursFromString(finish) - getHoursFromString(start);
            if (total.hasOwnProperty(opening_type)) {
                total[opening_type] += dayTotal;
            } else {
                total[opening_type] = dayTotal;
            }
        }
    }
    return total;
}