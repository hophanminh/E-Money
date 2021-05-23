import React from 'react';
import { MyProvider } from './MyContext';
import { WalletProvider } from './WalletContext';
import { PopupProvider } from './PopupContext';
import { CategoryProvider } from './CategoryContext';
import { EventProvider } from './EventContext';

const CombinedProvider = ({ children }) => (
    <MyProvider>
        <WalletProvider>
            <PopupProvider>
                <CategoryProvider>
                    <EventProvider>
                        {children}
                    </EventProvider>
                </CategoryProvider>
            </PopupProvider>
        </WalletProvider>
    </MyProvider>
)

export default CombinedProvider
