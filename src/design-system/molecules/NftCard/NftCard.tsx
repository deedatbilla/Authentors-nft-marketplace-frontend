import { Skeleton, Stack, Theme, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '../../atoms/Typography';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';
import { Box } from '@mui/system';
import TezosLogo from '../../atoms/TezosLogo/TezosLogo';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import CircularProgress from '../../atoms/CircularProgress';
import CustomCircularProgress from '../../atoms/CircularProgress';
import FlexSpacer from '../../atoms/FlexSpacer';

export interface NftCardProps {
    loading?: boolean;
    id?: string;
    name?: string;
    price?: number;
    height?: number;
    ipfsHash?: string;
    openFilters?: boolean;
    displayUri?: string;
    launchAt?: number;
    editionsAvailable?: number;
    nftCardMode?: 'user';
    ownerStatus?: 'pending' | 'owned';
}

const StyledCard = styled(Card)<{ theme?: Theme }>`
    &.MuiPaper-root {
        background-image: none !important;
        background-color: ${(props) => props.theme.palette.background.default};
    }
`;

const StyledBioWrapper = styled.div<{ theme?: Theme }>`
    align-self: flex-start;
    width: 100%;
`;

const StyledImgWrapper = styled.div<{ theme?: Theme }>`
    position: relative;
    overflow: hidden;
    height: 22.5vw !important;
    max-height: 25rem !important;
    border-radius: 1rem;
    transition: scale 0.2s;

    :hover {
        scale: 0.98;
    }

    @media (max-width: 1200px) {
        min-height: 24.5vw;
    }

    @media (max-width: 900px) {
        min-height: 40vw !important;
    }

    @media (max-width: 600px) {
        min-height: 85vw !important;
    }
`;

const StyledSkeleton = styled(Skeleton)`
    height: 22.5vw !important;
    max-height: 25rem !important;
    position: relative;
    border-radius: 1rem;

    @media (max-width: 1200px) {
        min-height: 24.5vw;
    }

    @media (max-width: 900px) {
        min-height: 40vw !important;
    }

    @media (max-width: 600px) {
        min-height: 85vw !important;
    }
`;

const StyledImg = styled.img<{ theme?: Theme; }>`
    position: absolute;
    border-radius: 1rem;
    width: 100%;
    height: -webkit-fill-available;
    object-position: center center;
    object-fit: cover;
    height: 100%;
`;

const AvailabilityWrapper = styled.div<{
    inStock: boolean;
    willDrop: boolean;
    pending?: boolean;
}>`
    position: absolute;

    top: 1rem;
    right: 1rem;

    background-color: ${(props) =>
        props.pending
            ? '#dadd10'
            : props.inStock
            ? props.willDrop
                ? '#136dff'
                : '#00ca00'
            : 'red'};

    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;

    border-radius: 0.5rem;
`;

const StyledWapper = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledCardContent = styled(CardContent)<{ theme?: Theme }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    flex-grow: 0;
    background-color: ${(props) => props.theme.palette.background.default};
`;

export const NftCard: React.FC<NftCardProps> = ({ loading, ...props }) => {
    const history = useHistory();
    const [componentLoading, setComponentLoading] = useState(true);
// console.log(props)
    const getIPFSHash = (url:string) => {
       const res =  url.split("//")
        return res[1]
    }
    const loadImage = async (imageUrl: string) => {
        let img;
        setComponentLoading(true);

        const imageLoadPromise = new Promise((resolve) => {
            img = new Image();
            img.onload = resolve;
            img.src = imageUrl
            // img.src = "https://ipfs.io/ipfs/QmbsFDLwTjSDypbQCjGJaZT4XbDQE62bRmrzJjn7Xvpw5E";
        });

        await imageLoadPromise;
        // comfort loader
        setTimeout(() => {
            setComponentLoading(false);
        }, 800);
        return img;
    };

    const handleRedirect = (path: string) => {
        history.push(path);
    };

    return !loading ? (
        <StyledCard
            onClick={() => handleRedirect(`/product/${props.id}`)}
            sx={{
                height: props.height,
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                width: '100%',
                minHeight: '100%',
                cursor: 'pointer',
                borderRadius: '1rem',
                boxShadow: 'none',
            }}
        >
            <StyledImgWrapper>
                <StyledImg   //https://ipfs.io/ipfs/QmbsFDLwTjSDypbQCjGJaZT4XbDQE62bRmrzJjn7Xvpw5E
                    data-object-fit="cover"
                    src={`https://ipfs.io/ipfs/${getIPFSHash(String(props.displayUri))}`}
                    alt={props.name}
                    onLoad={() =>
                        props.displayUri
                            ? loadImage(`https://ipfs.io/ipfs/${getIPFSHash(String(props.displayUri))}`)
                            : undefined
                    }
                    style={{
                        filter: `${componentLoading ? 'blur(20px)' : 'none'}`,
                    }}
                />
                {componentLoading && (
                    <StyledWapper>
                        <CircularProgress height={2} />
                    </StyledWapper>
                )}
            </StyledImgWrapper>

            <StyledCardContent
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
 <Typography
                    weight="SemiBold"
                    display="initial !important"
                   
                    size="h5"
                >
                    #{props.id}
                </Typography>
                <Typography
                    weight="SemiBold"
                    display="initial !important"
                   
                    size="h5"
                >
                    {props.name}
                </Typography>
            </StyledCardContent>
        </StyledCard>
    ) : (
        <StyledCard
            sx={{
                height: props.height,
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                width: '100%',
                minHeight: '100%',
                borderRadius: '1rem',
                boxShadow: 'none',
            }}
        >
            <StyledSkeleton
                variant="rectangular"
                width={'100%'}
                height={'120%'}
            />

            <StyledCardContent
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <StyledBioWrapper>
                    <Typography weight="SemiBold" size="h4">
                        <Skeleton width="7rem" />
                    </Typography>

                    <Box flexGrow="1" marginBottom=".5rem">
                        <Typography weight="Light" size="body">
                            <Skeleton width="5rem" />
                        </Typography>
                    </Box>
                </StyledBioWrapper>

                <Box
                    display="flex"
                    flexDirection="row"
                    alignSelf="self-start"
                    width="100%"
                >
                    <Typography weight="Light" size="body">
                        <Skeleton width="3rem" />
                    </Typography>

                    <Box display="flex" flexDirection="row" marginLeft="auto">
                        <Typography
                            weight="SemiBold"
                            size="h3"
                            marginLeft="auto"
                        >
                            <Skeleton width="3rem" />
                        </Typography>
                    </Box>
                </Box>
            </StyledCardContent>
        </StyledCard>
    );
};
