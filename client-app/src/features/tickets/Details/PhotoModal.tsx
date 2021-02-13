import React from 'react';
import { Modal, Image, List } from 'semantic-ui-react';
import FileRead from './FileRead';

const PhotoModal: React.FC<{
  img: any;
  isOpen: boolean;
  id: string;
  setIsModalOpen: (flag: boolean) => void;
  isPhoto?: boolean;
}> = ({ img, isOpen, id, setIsModalOpen, isPhoto }) => {
  return (
    <Modal
      key={id}
      open={isOpen && id === img.id}
      onClose={() => setIsModalOpen(false)}
      onOpen={() => setIsModalOpen(true)}
      size='small'
    >
      <Modal.Header>
        <List floated='right' horizontal>
          <List.Item href={img.url ? img.url : img.preview}>
            <p>Go to file</p>
          </List.Item>
        </List>
        <List flaoted='left' horizontal>
          <List.Item>
            <p>{img.name}</p>
          </List.Item>
        </List>
      </Modal.Header>
      {isPhoto && (
        <Image
          fluid
          src={img.url ? img.url : img.preview}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setIsModalOpen(false);
          }}
        />
      )}
      {!isPhoto && (
        <>
          <Modal.Content scrolling>
            <FileRead url={img} />
          </Modal.Content>
        </>
      )}
    </Modal>
  );
};

export default PhotoModal;
