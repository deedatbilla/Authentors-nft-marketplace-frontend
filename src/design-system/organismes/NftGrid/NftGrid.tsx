/* eslint-disable no-delete-var */
import styled from '@emotion/styled';
import Typography from '../../atoms/Typography';

import { FC, useEffect, useState } from 'react';
import { Grid, Stack } from '@mui/material';

import { NftCard } from '../../molecules/NftCard';
import { INft } from '../../../interfaces/artwork';
import { CertificateNFTS } from '../../../interfaces/certificates'
import { ATHENA_CPA_UNION_ADDRESS } from '../../../global';

export interface NftGridProps {
    editable?: boolean;
    assets?: any[];
    emptyMessage?: string;
    emptyLink?: string;
    loading?: boolean;
    open?: boolean;
    nfts?: CertificateNFTS[];
    openFilters?: boolean;
    collapsed?: boolean;
    sx?: any;
    nftCardMode?: 'user';
    collectionAddress?: string;
    collectionName?: string;
}

const StyledGrid = styled(Grid)`
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    max-width: none !important;
    flex-basis: 102% !important;
`;

const StyledDiv = styled.div`
    width: 100%;
`;

export const NftGrid: FC<NftGridProps> = ({ ...props }) => {

    const [comfortLoading, setComfortLoading] = useState<boolean>(false);


    useEffect(() => {
        if (props.loading) {
            setComfortLoading(true);
            setTimeout(() => {
                setComfortLoading(false);
            }, 400);
        }
    }, [props.loading]);

    return (
        <StyledDiv>
            {props.nfts && props.nfts.length > 0 ? (
                <StyledGrid
                    container
                    rowSpacing={4}
                    spacing={24}
                    columnSpacing={{ sm: 4 }}
                >
                    {props.nfts.map((nft, index) => (
                        <Grid
                            item
                            lg={3}
                            md={4}
                            sm={6}
                            xs={12}
                            key={`users-${index}`}
                        >
                            <NftCard
                                id={nft?.token.id.toString()}
                                name={nft.token.metadata?.name}
                                ipfsHash={nft.token.metadata?.artifactUri}
                                displayUri={nft.token.metadata?.displayUri}
                                artifactUri={nft.token.metadata?.artifactUri}
                                price={Number(nft?.balance)}
                                editionsAvailable={Number(
                                    nft?.firstTime,
                                )}
                            />
                        </Grid>
                    ))}
                </StyledGrid>
            ) : props.loading || comfortLoading ? (
                <StyledGrid
                    container
                    rowSpacing={5}
                    columnSpacing={{ xs: 1, sm: 2, md: 5 }}
                >
                    {[...new Array(8)].map((nft, index) => (
                        <Grid
                            item
                            lg={3}
                            md={4}
                            sm={6}
                            xs={12}
                            key={`nft-loader-${index}`}
                        >
                            <NftCard
                                name={''}
                                ipfsHash={''}
                                price={0}
                                openFilters={props.openFilters}
                                loading={true}
                            />
                        </Grid>
                    ))}
                </StyledGrid>
            ) : (
                <StyledGrid>
                    <Stack
                        direction="column"
                        sx={{ minHeight: '20vh', justifyContent: 'center' }}
                    >
                        <Typography
                            size="h2"
                            weight="Light"
                            align="center"
                            color="#C4C4C4"
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {props.emptyMessage
                                ? props.emptyMessage
                                : 'No Data'}
                        </Typography>
                        <Typography
                            size="subtitle2"
                            weight="Light"
                            align="center"
                            color="#0088a7"
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            {props.emptyLink ? props.emptyLink : undefined}
                        </Typography>
                    </Stack>
                </StyledGrid>
            )}
        </StyledDiv>
    );
};
