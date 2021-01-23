import React from 'react';
import { Popup } from 'semantic-ui-react';

const dotStyles = {
  border: '1px solid',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'inline-block',
  margin: '2px',
};
interface IProps {
  circleColor?: string;
  status: string;
  isFilled?: boolean;
}
const StatusCircle: React.FC<IProps> = ({ circleColor, status, isFilled }) => {
  const findColor = () => {
    if (status?.toLowerCase() === 'open') {
      return 'blue';
    } else if (status?.toLowerCase() === 'verify') {
      return 'green';
    } else if (status?.toLowerCase() === 'closed') {
      return 'red';
    }
  };
  return (
    <Popup
      header={`Status: ${status}`}
      trigger={
        <span
          style={{
            color: findColor(),
            backgroundColor: isFilled ? findColor() : undefined,
            ...dotStyles,
          }}
        />
      }
    />
  );
};

export default StatusCircle;
