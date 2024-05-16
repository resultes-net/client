import * as res from 'ts-results';

export type ProfileSummary = {
	monthly_data: { months: number[]; energy: number[] };
	yearly_data: { total: number };
};

export const container: { profileSummary: res.Option<ProfileSummary> } = {
	profileSummary: res.None
};
