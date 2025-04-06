export type Player = {
    id: number;
    name: string;
    url_name: string;
    image_version: number;
    price: number;
    stats: {
        rating: number;
        ct_rating: number;
        t_rating: number;
        awp: number;
        hs: number;
        entry_rounds: number;
        clutch_rounds: number;
        support_rounds: number;
        mk_rounds: number;
        dpr: number;
    }
};