import {B} from './curried/combinators.js'
import {concat, fold, map} from './curried/array.js'
import {car, chunk, cons} from './curried/array-extra.js'
import {append, elem} from './curried/dom-helpers.js'
import {eq} from './curried/comparators.js'

const timeElem = attrs => elem('time')(attrs)

const isFirstZero = B(eq(0))(car)

const pad = num => String(num).padStart(2, '0')

const monthWeeks = year => month => {
  const firstWeekday = new Date(year, month).getDay()
  const lastDay = new Date(new Date(year, month + 1) - 1).getDate()

  // NOTE week start on monday
  const padAmount = eq(firstWeekday)(0) ? 6 : firstWeekday - 1

  return chunk
    (7)
    (concat
      (cons
        (_ => 0)
        (new Array(padAmount)))
      (cons
        ((_, i) => i + 1)
        (new Array(lastDay))))
}

const yearDays = year =>
  map
    (monthWeeks(year))
    (cons
      ((_, i) => i)
      (new Array(12)))

export const yearElems = year => {
  let weekNum = 0

  const monthElems = (yearElem, month, monthIndex) =>
    append
      (yearElem)
      (fold
        (timeElem({
          className: 'month'
          , dateTime: `${year}-${pad(monthIndex + 1)}`
        }))
        (weekElems)
        (month))

  const weekElems = (monthElem, week) =>
    append
      (monthElem)
      (fold
        (timeElem({
          className: 'week'
          , dateTime: `${year}-W${isFirstZero(week) ? weekNum : ++weekNum}`
        }))
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
    (yearDays(Number(year)))
}
