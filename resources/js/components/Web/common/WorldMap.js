import React, { Component } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

var width = window.innerHeight * 0.97;
var height = width / 1.85;

class WorldMap extends Component {
	constructor() {
		super();
		this.state = {
			worldData: []
		};
	}
	projection() {
		return (
			geoMercator()
				// .scale(100)
				// .translate([ 800 / 2, 450 / 2 ])
				.scale([ width / 3.5 ])
				.translate([ width / 1, height * 1.4 ])
		);
	}
	componentDidMount() {
		fetch('/world-110m.json').then((response) => {
			if (response.status !== 200) {
				// return
			} else {
				response.json().then((worldData) => {
					this.setState({
						worldData: feature(worldData, worldData.objects.countries).features
					});
				});
			}
		});
	}
	render() {
		return (
			<svg width={800} height={450} viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
				<g className="countries">
					{this.state.worldData.map((d, i) => (
						<path
							key={`path-${i}`}
							d={geoPath().projection(this.projection())(d)}
							className="country"
							fill={`rgba(38,50,56,${1 / this.state.worldData.length * i})`}
							stroke="#FFFFFF"
							strokeWidth={0.5}
						/>
					))}
				</g>
				{/* <g className="markers">
          <circle
            cx={ this.projection()([8,48])[0] }
            cy={ this.projection()([8,48])[1] }
            r={ 10 }
            fill="#E91E63"
            className="marker"
          />
        </g> */}
			</svg>
		);
	}
}

export default WorldMap;
