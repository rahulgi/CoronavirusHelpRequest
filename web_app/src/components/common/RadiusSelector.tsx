import React, { useState, useEffect } from "react";
import styled from "@emotion/styled/macro";
import { Option, Select } from "./Select";

const OPTIONS: Option[] = [
  { label: "1km", value: "1" },
  { label: "2km", value: "2" },
  { label: "5km", value: "5" },
  { label: "10km", value: "10" },
  { label: "20km", value: "20" },
  { label: "50km", value: "50" }
];

const StyledSelect = styled(Select)`
  max-width: 100px;
`;

export const RadiusSelector: React.FC<{
  labelText?: string;
  startingRadius: string;
  onRadiusChanged: (radius: string) => void;
}> = ({ labelText, onRadiusChanged, startingRadius }) => {
  const [radius, setRadius] = useState(startingRadius);

  useEffect(() => {
    onRadiusChanged(radius);
  }, [radius]);

  useEffect(() => {
    setRadius(startingRadius);
  }, [startingRadius]);

  return (
    <StyledSelect
      labelText={labelText}
      value={radius}
      options={OPTIONS}
      onChange={option => setRadius(option.value)}
      collapseDescriptionSpace
    />
  );
};
