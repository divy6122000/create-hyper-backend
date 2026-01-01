import mongoose from "mongoose";
import { Types } from "mongoose";
import { User } from "../models/user.model.ts";
import { logger } from "../utils/logger.ts";

export const exampleAggregation = async (userId: string) => {
    try {
        const exampleAggregationData = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'companydetails',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'companyDetails',
                },
            },
            {
                $unwind: { path: '$companyDetails', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'usersubscriptions',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'subscriptionDetails',
                },
            },
            {
                $unwind: {
                    path: '$subscriptionDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phoneNumber: 1,
                    status: 1,
                    profileImg: 1,
                    profileCoverImage: 1,
                    isPrivate: 1,
                    companyDetails: 1,
                    subscriptionDetails: 1,
                },
            },
        ]);
        if(exampleAggregationData.length > 0){
            return exampleAggregationData[0];
        }
    } catch (error: any) {
        logger.error("Error in exampleAggregation:", error);
        throw error;
    }
}