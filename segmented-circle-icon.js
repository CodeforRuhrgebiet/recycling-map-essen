
L.SegmentedCircleIcon = L.Icon.extend({

  options: {
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  },
  _radius: 16,
  _segments: 1,

  initialize: function (options) {
    this.options = L.setOptions(this, options)
    this._radius = (this.options.radius) ? this.options.radius : (this.options.iconSize[0] / 2)

    if (typeof this.options.segments === Number) {
      this._segments = this._compileSegments(this.options.segments)
    } else {
      this._segments = this.options.segments
    }
  },

  _compileSegments: function (segmentCount) {
    let segments = []
    for (let i = segmentCount; i > 0; i--) {
      segment.push({
        className: `segment segment-${i}`
      })
    }
    return segments;
  },

  _createIcon: function (name, oldIcon) {
    let segmentCount = this._segments.length
    let segmentLength = 360 / segmentCount

    let startAngle = 0
    let endAngle = segmentLength

    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', this.options.iconSize[0])
    svg.setAttribute('height', this.options.iconSize[1])

    // TODO: Some containers do not have any segments. Figure out why
    if (this._segments.length === 0) {
      return svg;
    }

    // draw a full circle if there is only one segment
    if (this._segments.length === 1) {
      let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('class', this._segments[0].className)
      circle.setAttribute('cx', this.options.iconSize[0] / 2)
      circle.setAttribute('cy', this.options.iconSize[1] / 2)
      circle.setAttribute('r', this._radius)
      svg.appendChild(circle)

      // generate path for each segment
    } else {
      this._segments.forEach((segment) => {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        let arc = this._describeArc(
          (this.options.iconSize[0] / 2),
          (this.options.iconSize[1] / 2),
          this._radius,
          startAngle,
          endAngle
        )

        path.setAttribute('d', arc)
        path.setAttribute('class', segment.className)
        svg.appendChild(path)

        startAngle = startAngle + segmentLength
        endAngle = endAngle + segmentLength
      })
    }

    return svg
  },

  // Kudos to user opsb @ stackoverflow.com http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle#18473154
  _polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  },

  _describeArc: function (x, y, radius, startAngle, endAngle) {

    let start = this._polarToCartesian(x, y, radius, endAngle)
    let end = this._polarToCartesian(x, y, radius, startAngle)

    let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    let d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ")

    return d;
  }

})

L.segmentedCircleIcon = (options) => {
  return new L.SegmentedCircleIcon(options)
}
