import React from 'react';
import fullTrayImg from '../assets/trays/full_tray.jpg';
import mediumTrayImg from '../assets/trays/medium_tray.jpg';
import smallTrayImg from '../assets/trays/small_tray.png';
import extraSmallTrayImg from '../assets/trays/extrasmall_tray.jpg';

const Tray = ({ name, image, capacity, dimensions }) => {
  return (
      <div>
          <h2><b>{name}</b></h2>
      <img src={image} alt={name}  />
          <p><b>Capacity</b>: {capacity.fluidOunces} fl oz ({capacity.liters} L)</p>
          <p><b>Dimensions</b>: {dimensions.length}L x {dimensions.width}W x {dimensions.depth}D inches</p>
    </div>
  );
};

const trays = [
  {
    name: 'Full Tray',
    image: fullTrayImg,
    capacity: {
      fluidOunces: 346,
      liters: 10.23,
    },
    dimensions: {
      length: '20-3/4',
      width: '12-13/16',
      depth: '3-3/8',
    },
  },
  {
    name: 'Medium Tray',
    image: mediumTrayImg,
    capacity: {
      fluidOunces: 228,
      liters: 6.75,
    },
    dimensions: {
      length: '20-3/4',
      width: '12-13/16',
      depth: '2',
    },
  },
  {
    name: 'Small Tray',
    image: smallTrayImg,
    capacity: {
      fluidOunces: 120,
      liters: 3.55,
    },
    dimensions: {
      length: '12-3/4',
      width: '10-3/8',
      depth: '2-9/16',
    },
  },
  {
    name: 'Extra Small Tray',
    image: extraSmallTrayImg,
    capacity: {
      fluidOunces: 104,
      liters: 3.07,
    },
    dimensions: {
      length: '12-3/4',
      width: '10-3/8',
      depth: '2-3/16',
    },
  },
];

const TrayList = () => {
  return (
    <div className="traySizes">
      {trays.map((tray) => (
        <Tray key={tray.name} name={tray.name} image={tray.image} capacity={tray.capacity} dimensions={tray.dimensions} />
      ))}
    </div>
  );
};

export default TrayList;











