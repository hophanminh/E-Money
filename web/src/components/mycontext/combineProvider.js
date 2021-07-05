import React from 'react';
import { MyProvider } from './MyContext';
import { WalletProvider } from './WalletContext';
import { PopupProvider } from './PopupContext';
import { CategoryProvider } from './CategoryContext';
import { EventProvider } from './EventContext';
import { IconProvider } from './IconContext';

const CombinedProvider = ({ children }) => (
  <MyProvider>
    <WalletProvider>
      <PopupProvider>
        <CategoryProvider>
          <EventProvider>
            <IconProvider>
              {children}
            </IconProvider>
          </EventProvider>
        </CategoryProvider>
      </PopupProvider>
    </WalletProvider>
  </MyProvider>
);

export default CombinedProvider;
