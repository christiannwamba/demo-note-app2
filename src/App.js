import {
  CreateNote,
  NavBar,
  NoteUICollection,
  UpdateNote,
} from './ui-components';

import React from 'react';

import { Hub } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { DataStore } from "aws-amplify";

function App({signOut}) {
  const [showCreateModel, setShowCreateModel] = React.useState(false);
  const [showUpdateModel, setShowUpdateModel] = React.useState(false);
  const [noteToUpdate, setNoteToUpdate] = React.useState();

  React.useEffect(() => {
    Hub.listen('ui', (capsule) => {
      if (capsule.payload.event === 'actions:datastore:create:finished') {
        setShowCreateModel(false);
      }
      if (capsule.payload.event === 'actions:datastore:update:finished') {
        setShowUpdateModel(false);
      }
    });
  }, []);
  return (
    <>
      <NavBar
        width="100%"
        marginBottom="20px"
        overrides={{
          Button31632483: { onClick: () => setShowCreateModel(true) },

          Button31632487: {
            onClick: async () => {
              signOut();
              await DataStore.clear();
            },
          },
        }}
      />
      <div className="container">
        <NoteUICollection
          overrideItems={({ item, idx }) => {
            return {
              overrides: {
                Vector31472745: {
                  onClick: () => {
                    console.log(item);
                    setShowUpdateModel(true);
                    setNoteToUpdate(item);
                  },
                },
              },
            };
          }}
        />
      </div>

      <div
        className="modal"
        style={{ display: showCreateModel === false && 'none' }}
      >
        <CreateNote
          overrides={{
            MyIcon: { as: 'button', onClick: () => setShowCreateModel(false) },
          }}
        />
      </div>
      <div
        className="modal"
        style={{ display: showUpdateModel === false && 'none' }}
      >
        <UpdateNote
          note={noteToUpdate}
          overrides={{
            MyIcon: { as: 'button', onClick: () => setShowUpdateModel(false) },
            // Button: { onClick: () => setShowUpdateModel(false)}
          }}
        />
      </div>
    </>
  );
}
export default withAuthenticator(App);
