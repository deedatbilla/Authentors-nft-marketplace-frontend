import styled from '@emotion/styled';
import Avatar from '../../../atoms/Avatar';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import ProfilePopover from '../../ProfilePopover';

import { Badge } from '@mui/material';
import { QuickSearch } from '../../../molecules/QuickSearch';
import { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { CustomButton } from '../../../atoms/Button';
import { Typography } from '../../../atoms/Typography';
import { MenuProps, StyledShoppingCartRoundedIcon, StyledLink } from '../Menu';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

const DesktopMenuContent = styled(Stack)`
    display: none;
    margin-top: 0 !important;

    @media (min-width: 875px) {
        display: flex;
    }
`;

export const DesktopMenu: FC<MenuProps> = ({ user, onLogout, ...props }) => {
    const history = useHistory();
    const location = useLocation();

    const { t } = useTranslation(['translation']);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <DesktopMenuContent
                direction={{ xs: 'row' }}
                spacing={4}
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                {/* Link to general pages */}

               

                {/* Call to action button: `Sign in`, `Add artwork` for curators and artists, and profile avatar to display the submenu */}

               
              
                {props.selectedTheme === 'dark' ? (
                    <Brightness3Icon
                        onClick={() => props.switchTheme('light')}
                        sx={{ cursor: 'pointer' }}
                    />
                ) : (
                    <WbSunnyOutlinedIcon
                        onClick={() => props.switchTheme('dark')}
                        sx={{ cursor: 'pointer' }}
                    />
                )}
            </DesktopMenuContent>

            <ProfilePopover
                open={Boolean(anchorEl)}
                avatarSrc={`${user?.profilePicture}?${Date.now()}`}
                address={user?.userAddress}
                history={history}
                logOut={onLogout}
                onClose={handleClose}
                onClick={handleClose}
            />
        </>
    );
};
