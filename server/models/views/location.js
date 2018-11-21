const hoek = require('hoek')
const BaseViewModel = require('./')
const severity = require('../severity')
const { groupBy } = require('../../util')

const defaults = {
  metadata: {
    keywords: '...',
    description: '...'
  }
}

class ViewModel extends BaseViewModel { // Inherit from National for now, Base eventually
  constructor ({ place, floods, stations }) {
    const title = place.name

    super(hoek.applyToDefaults(defaults, {
      place,
      floods,
      location: title,
      pageTitle: `${title} flood risk - GOV.UK`
    }))

    // Floods
    if (floods.length) {
      const activeFloods = floods.filter(flood => flood.severity < 4)
      const hasActiveFloods = !!activeFloods.length

      const inactiveFloods = floods.filter(flood => flood.severity === 4)
      const hasInactiveFloods = !!inactiveFloods.length

      const groups = groupBy(floods, 'severity')
      const groupedFloods = Object.keys(groups).map(group => {
        return {
          floods: groups[group],
          severity: severity[group - 1]
        }
      })

      if (hasActiveFloods) {
        const summary = groupedFloods.map(group => {
          const count = group.floods.length
          const groupSeverity = group.severity
          const title = count === 1
            ? groupSeverity.title
            : groupSeverity.pluralisedTitle

          return { count, title }
        })

        const statements = summary.map(item => `${item.count} ${item.title.toLowerCase()}`)
        const floodsSummaryBody = statements.reduce((accumulator, currentValue, index, arr) => {
          return `${accumulator}${(index === arr.length - 1) ? ' and' : ','} ${currentValue}`
        })

        const floodsSummary = `There ${summary[0].count === 1 ? 'is' : 'are'} currently ${floodsSummaryBody} in force in this area.`
        const highestSeverityId = Math.min(...floods.map(flood => flood.severity))

        this.highestSeverity = severity[highestSeverityId - 1]
        this.groupedFloods = groupedFloods
        this.floodsSummary = floodsSummary
      }

      this.activeFloods = activeFloods
      this.hasActiveFloods = hasActiveFloods
      this.inactiveFloods = inactiveFloods
      this.hasInactiveFloods = hasInactiveFloods
    }

    // Rivers
    if (stations.length) {
      this.rivers = groupBy(stations, 'wiski_river_name')
    }
  }
}

module.exports = ViewModel
