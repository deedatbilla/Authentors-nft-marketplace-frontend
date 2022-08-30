import useAxios from 'axios-hooks';
import styled from '@emotion/styled';
import ListIcon from '@mui/icons-material/List';
import NftGrid from '../../design-system/organismes/NftGrid';
import FlexSpacer from '../../design-system/atoms/FlexSpacer';
import PageWrapper from '../../design-system/commons/PageWrapper';
import StoreFilters from '../../design-system/organismes/StoreFilters';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useEffect, useState } from 'react';
import {
    Stack,
    Theme,
    Pagination,
    useMediaQuery,
    useTheme,
    Chip,
    SelectChangeEvent,
} from '@mui/material';

import { CustomSelect } from '../../design-system/atoms/Select';
import { Typography } from '../../design-system/atoms/Typography';
import { useHistory } from 'react-router';
import { string } from 'yup';
import {
    ATHENA_CPA_UNION_ADDRESS,
    NUMBER_OF_ITEMS_PER_PAGE,
} from '../../global';

interface ParamTypes {
    width?: any;
}

interface SortProps {
    orderBy: 'price' | 'name' | 'createdAt';
    orderDirection: 'asc' | 'desc';
}

const StyledStack = styled(Stack)`
    max-width: 100rem;
    width: 100%;
    height: 100%;
`;

const StyledContentStack = styled(Stack)<ParamTypes>`
    flex-direction: row;
    width: 100%;
    margin-top: 2.5rem !important;

    @media (max-width: 900px) {
        flex-direction: column;
    }
`;

const StyledPagination = styled(Pagination)<{
    theme?: Theme;
    display: boolean;
}>`
    display: ${(props) => (props.display ? 'flex' : 'none')};

    .MuiPaginationItem-root {
        border-radius: 0;

        font-family: 'Poppins' !important;
    }

    .MuiPaginationItem-root.Mui-selected {
        background-color: ${(props) =>
            props.theme.palette.background.default} !important;
        border: 1px solid ${(props) => props.theme.palette.text.primary} !important;
    }

    nav {
        display: flex;
        align-items: center !important;
    }
`;

const StyledChevronLeftIcon = styled(ChevronLeftIcon)<{
    opened: boolean;
    theme?: Theme;
}>`
    height: 1.8rem;
    width: 1.8rem;
    color: ${(props) => props.theme.palette.text.primary};
    transform: ${(props) => (props.opened ? '' : 'rotate(180deg)')};

    transition: transform 0.3s;

    cursor: pointer;
`;

const StyledChip = styled(Chip)<{ theme?: Theme }>`
    margin-left: 1.5rem;
    border: 1px solid #c4c4c4;
`;

export interface IParamsNFTs {
    handlePriceRange: boolean;
    page?: number;
    categories?: number[];
    orderBy?: string;
    orderDirection?: string;
    priceAtLeast?: number;
    priceAtMost?: number;
    availability?: string[];
}

export interface ITreeCategory {
    id: number | string;
    name: string;
    parent?: ITreeCategory;
    children?: ITreeCategory[];
}

const StorePage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const history = useHistory();

    // Pagination state
    const [selectedPage, setSelectedPage] = useState<number>(1);

    // Sort state
    const [selectedSort, setSelectedSort] = useState<{
        orderBy: 'price' | 'name' | 'createdAt';
        orderDirection: 'asc' | 'desc';
    }>();

    // Categories state
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [preSelectedCategories, setPreSelectedCategories] = useState<any[]>(
        [],
    );
    // Availability state
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
        [],
    );

    // Price states
    const [priceFilterRange, setPriceFilterRange] =
        useState<[number, number]>();

    // Conditionnal states
    const [filterOpen, setFilterOpen] = useState<boolean>(true);

    const [filterSliding, setFilterSliding] = useState<boolean>(false);
    const [comfortLoader, setComfortLoader] = useState<boolean>(false);
    const [onInit, setOnInit] = useState(true);
    const [collection, setCollection] = useState<string>('');
    const [walletAdress, setWalletAddres] = useState<string>('');
    const [allNfts, setAllNfts] = useState<any[]>([]);
    const [filteredNfts, setFilteredNfts] = useState<any[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);

    // Api calls for the categories and the nfts
    const [nftsResponse, getNfts] = useAxios(
        process.env.REACT_APP_TZKIT_API_URL + `balances`,
        { manual: false },
    );

    useEffect(() => {
        fetchNftData();
    }, []);
    useEffect(() => {
        getPageParams();
    }, [selectedPage]);

    const callNFTsEndpoint = async (
        address: string,
        limit: string,
        collection: string,
    ) => {
        setComfortLoader(true);
        try {
            const { data } = await getNfts({
                params: {
                    'account.eq': address ?? 1,
                    limit: limit ?? 20,
                },
            });
            const filtered: any[] = prepareNftData(data, address, collection);

            setAllNfts(filtered);
            setFilteredNfts(filtered.slice(0, NUMBER_OF_ITEMS_PER_PAGE));
            const pgCount = filtered.length / NUMBER_OF_ITEMS_PER_PAGE;
            setPageCount(Number(pgCount.toFixed(0)));

            setComfortLoader(false);
        } catch (error) {
            console.log(error);
            setComfortLoader(false);
        }
    };

    const getPageParams = () => {
        let pageParam = new URLSearchParams(history.location.search);

        const page = pageParam.get('page');

        // Pagination
        if (page) {
            setSelectedPage(Number(page));
        }
        computePagination(Number(page));
    };

    const fetchNftData = () => {
        let pageParam = new URLSearchParams(history.location.search);

        const page = pageParam.get('page');

        const collection = pageParam.get('collection');
        const limit = pageParam.get('limit');

        const walletAdress = pageParam.get('address');
        if (page) {
            setSelectedPage(Number(page));
        }
        setCollection(String(collection));
        setWalletAddres(String(walletAdress));
        callNFTsEndpoint(
            String(walletAdress),
            String(limit),
            String(collection),
        );
    };

    const setPageParams = (
        queryParam:
            | 'categories'
            | 'page'
            | 'availability'
            | 'priceAtLeast'
            | 'priceAtMost'
            | 'orderBy'
            | 'orderDirection',
        queryParamValue: string,
    ) => {
        const actualPageParam = new URLSearchParams(history.location.search);

        if (actualPageParam.get(queryParam)) {
            actualPageParam.set(queryParam, queryParamValue);
        } else {
            actualPageParam.append(queryParam, queryParamValue);
        }

        history.push({ search: actualPageParam.toString() });
    };

    const handlePaginationChange = (event: any, page: number) => {
        let pageParam = new URLSearchParams(history.location.search);
        const walletAdress = pageParam.get('address');
        const limit = pageParam.get('limit');
        setSelectedPage(page);
        setPageParams('page', page.toString());
        window.scrollTo(0, 0);
        computePagination(page);
    };

    const computePagination = (page: number) => {
        console.log(page);
        const firstIndex = (page - 1) * NUMBER_OF_ITEMS_PER_PAGE; //we want to show 8 items per page
        const lastIndex = page * NUMBER_OF_ITEMS_PER_PAGE;
        let filtered = allNfts;

        filtered = filtered.slice(firstIndex, lastIndex);
        setFilteredNfts(filtered);
    };

    const [availableFilters, setAvailableFilters] = useState<ITreeCategory[]>();
    const prepareNftData = (
        data: any,
        walletAdress: string,
        collection: string,
    ) => {
        let arr = [...data];

        let res: any[] = [];
        for (const element of arr) {
            if (element.hasOwnProperty('token')) {
                if (element.token.hasOwnProperty('metadata')) {
                    if (element.token.metadata.hasOwnProperty('creators')) {
                        console.log('got a creators');
                        if (
                            element.token.metadata.creators.includes(
                                walletAdress,
                            )
                        ) {
                            console.log('got a address');
                            res.push(element);
                        } else {
                            console.log('got no address');
                        }
                    } else {
                        console.log('got no.. creators');
                    }
                } else {
                    console.log('got no metadat');
                }
                console.log('got a token', element.token);
            } else {
                console.log('got no token', element.token);
            }
        }
        if (
            walletAdress === ATHENA_CPA_UNION_ADDRESS &&
            collection === 'CPA Union of Israel'
        ) {
            res = res.filter(
                (nft: any) =>
                    nft.token.metadata?.name ===
                    'Graduation Diploma of CPA "Crypto Course"',
            );

           
        }
        if (
            walletAdress === ATHENA_CPA_UNION_ADDRESS &&
            collection === 'ATHENA Certificates'
        ) {
            res = res.filter(
                (nft: any) =>
                    nft.token.metadata?.name ===
                    'Certificate of Appreciation from The Institute of Certified Public Accountants in Israel',
            );

          
        }
        return res;
    };

    return (
        <PageWrapper>
            <StyledStack direction="column" spacing={3}>
                <FlexSpacer minHeight={isMobile ? 6 : 10} />

                {!isMobile && (
                    <Typography
                        size="h1"
                        weight="SemiBold"
                        sx={{ justifyContent: 'center' }}
                    >
                        {collection}
                    </Typography>
                )}

                <FlexSpacer />

                {/* Toggle options */}

                <StyledContentStack>
                    {/* <StoreFilters
                        availableFilters={availableFilters}
                        openFilters={isMobile ? !filterOpen : filterOpen}
                        callNFTsEndpoint={callNFTsEndpoint}
                        setFilterOpen={setFilterOpen}
                        preSelectedFilters={preSelectedCategories}
                        selectedFilters={selectedCategories}
                        setSelectedFilters={setSelectedCategories}
                        priceFilterRange={priceFilterRange}
                        setPriceFilterRange={setPriceFilterRange}
                        loading={
                            categoriesResponse.loading && nftsResponse.loading
                        }
                        minRange={nftsResponse.data?.lowerPriceBound ?? 0}
                        maxRange={nftsResponse.data?.upperPriceBound ?? 100}
                        triggerPriceFilter={triggerPriceFilter}
                        setFilterSliding={setFilterSliding}
                        availabilityFilter={selectedAvailability}
                        setAvailabilityFilter={setSelectedAvailability}
                    /> */}

                    <NftGrid
                        open={filterOpen}
                        nfts={filteredNfts}
                        collectionAddress={walletAdress}
                        collectionName={collection}
                        loading={
                            nftsResponse.loading ||
                            filterSliding ||
                            comfortLoader
                        }
                    />
                </StyledContentStack>

                <Stack direction="row">
                    <FlexSpacer />
                    <StyledPagination
                        display={nftsResponse.data?.length > 1}
                        page={selectedPage}
                        count={pageCount}
                        onChange={handlePaginationChange}
                        variant="outlined"
                        shape="rounded"
                        disabled={
                            nftsResponse.loading ||
                            filterSliding ||
                            comfortLoader
                        }
                    />
                </Stack>

                <FlexSpacer minHeight={5} />
            </StyledStack>
        </PageWrapper>
    );
};

export default StorePage;
