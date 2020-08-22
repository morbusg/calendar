import {chunk, concat, cons, fold, map} from './curried-functions.js'
import {append, elem} from './dom-helpers.js'

const indexSucc = (_, i) => i + 1

const timeElem = attrs => elem('time')(attrs)

const pad = num => String(num).padStart(2, '0')

const monthWeeks = year => month =>
  chunk
    (7)
    (concat
      (cons
        (_ => 0)
        (new Array(Math.max(new Date(year, month).getDay() - 1, 0))))
      (cons
        (indexSucc)
        (new Array(new Date(year, month, -0).getDate()))))

const yearDays = year =>
  map
    (monthWeeks(year))
    (cons
      (indexSucc)
      (new Array(12)))

export const yearElems = year => {
  let weekNum = 0

  const monthElems = (yearElem, month, monthNum) =>
    append
      (yearElem)
      (fold
        (timeElem({
          className: 'month'
          , dateTime: `${year}-${pad(monthNum + 1)}`
        }))
        (weekElems)
        (month))

  const weekElems = (monthElem, week) =>
    append
      (monthElem)
      (fold
        (timeElem({className: 'week', dateTime: `${year}-W${++weekNum}`}))
        ((weekElem, day) =>
          append
            (weekElem)
            (day === 0
              ? elem('span')({className: 'day'})
              : timeElem({
                  className: 'day'
                  , textContent: day
                  , dateTime: `${monthElem.dateTime}-${pad(day)}`
                })))
        (week))

  return fold
    (timeElem({className: 'year', dateTime: year}))
    (monthElems)
    (yearDays(year))
}
