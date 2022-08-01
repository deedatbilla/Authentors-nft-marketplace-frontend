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

    // Api calls for the categories and the nfts
    const [nftsResponse, getNfts] = useAxios(
        process.env.REACT_APP_TZKIT_API_URL + `balances`,
        { manual: false },
    );
    const [categoriesResponse, getCategories] = useAxios(
        process.env.REACT_APP_API_SERVER_BASE_URL + '/categories',
        { manual: true },
    );

    useEffect(() => {
        getCategories();
        getPageParams();
    }, [selectedPage]);

    useEffect(() => {
        if (history.location.state) {
            const state: any = history.location.state;
            if (state.refresh && state.category)
                setPreSelectedCategories([state.category]);
        }
    }, [history.location.state]);

    const callNFTsEndpoint = (address: string, limit: string) => {
        setComfortLoader(true);
        const comfortTrigger = setTimeout(() => {
            getNfts({
                params: {
                    'account.eq': address ?? 1,
                    limit: limit ?? 20,
                },
            }).then((response) => {});
            setComfortLoader(false);
        }, 400);

        return () => {
            clearTimeout(comfortTrigger);
        };
    };

    const getPageParams = () => {
        let pageParam = new URLSearchParams(history.location.search);

        const page = pageParam.get('page');

        const collection = pageParam.get('collection');
        const limit = pageParam.get('limit');

        const walletAdress = pageParam.get('address');
        setCollection(String(collection));
        setWalletAddres(String(walletAdress));
        // Pagination
        if (page) {
            setSelectedPage(Number(page));
        }

        callNFTsEndpoint(String(walletAdress), String(limit));
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

    const deletePageParams = (
        queryParam:
            | 'categories'
            | 'page'
            | 'availability'
            | 'priceAtLeast'
            | 'priceAtMost'
            | 'orderBy'
            | 'orderDirection',
    ) => {
        const actualPageParam = new URLSearchParams(history.location.search);

        if (actualPageParam.get(queryParam)) {
            actualPageParam.delete(queryParam);
        }

        history.push({ search: actualPageParam.toString() });
    };

    const handlePaginationChange = (event: any, page: number) => {
        let pageParam = new URLSearchParams(history.location.search);
        const walletAdress = pageParam.get('address');
        const limit = pageParam.get('limit');
        setSelectedPage(page);
        setPageParams('page', page.toString());
        // callNFTsEndpoint(String(walletAdress), Number(page), String(limit));
        window.scrollTo(0, 0);
    };

    const triggerPriceFilter = () => {
        if (priceFilterRange) {
            setPageParams('priceAtLeast', priceFilterRange[0].toString());
            setPageParams('priceAtMost', priceFilterRange[1].toString());
        }
        // callNFTsEndpoint({ handlePriceRange: true });
    };

    useEffect(() => {
        if (!onInit) {
            if (selectedSort) {
                setPageParams('orderBy', selectedSort.orderBy);
                setPageParams('orderDirection', selectedSort.orderDirection);
            } else {
                deletePageParams('orderBy');
                deletePageParams('orderDirection');
            }
        }
    }, [selectedSort]);

    useEffect(() => {
        if (!onInit) {
            if (selectedCategories.length)
                setPageParams('categories', selectedCategories.join(','));
            else deletePageParams('categories');
        }
    }, [selectedCategories]);

    useEffect(() => {
        if (!onInit) {
            if (selectedAvailability.length)
                setPageParams('availability', selectedAvailability.join(','));
            else deletePageParams('availability');
        }
    }, [selectedAvailability]);

    const [availableFilters, setAvailableFilters] = useState<ITreeCategory[]>();

    // useEffect(() => {
    //     if (categoriesResponse.data) {
    //         setAvailableFilters([
    //             {
    //                 id: 'root',
    //                 name: 'Categories',
    //                 children: categoriesResponse.data,
    //             },
    //         ]);
    //         setOnInit(false);
    //     }
    // }, [categoriesResponse.data]);

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
                        nfts={nftsResponse?.data}
                        collectionAddress={walletAdress}
                        collectionName={collection}
                        loading={
                            nftsResponse.loading ||
                            filterSliding ||
                            comfortLoader
                        }
                    />
                </StyledContentStack>

                {/* <Stack direction="row">
                    <FlexSpacer />
                    <StyledPagination
                        display={nftsResponse.data?.length > 1}
                        page={selectedPage}
                        count={nftsResponse.data?.length}
                        onChange={handlePaginationChange}
                        variant="outlined"
                        shape="rounded"
                        disabled={
                            nftsResponse.loading ||
                            filterSliding ||
                            comfortLoader
                        }
                    />
                </Stack> */}

                <FlexSpacer minHeight={5} />
            </StyledStack>
        </PageWrapper>
    );
};

export default StorePage;
