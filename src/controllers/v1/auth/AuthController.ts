import { autoInjectable } from 'tsyringe';
import { BaseController } from '../BaseController';
import { Request, Response } from 'express';
import { PostBack } from '../../../models/interfaces/IPostBack';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { UserModel } from '../../../models/User';

@autoInjectable()
export class AuthController extends BaseController {

    constructor() {
        super();
        this.logIn = this.logIn.bind(this);
    }

    async logIn(req: Request, res: Response) {
        const authData: PostBack = req.body;
        const clientId = process.env.SPOTIFY_CLIENT_ID;

        if (!clientId) {
            res.send(500).send('Internal Server Error!');
            return;
        }

        try {
            const sdk = SpotifyApi.withAccessToken(clientId, authData);
            const spotifyUser = await sdk.currentUser.profile();

            const user = await UserModel.findOne({ name: spotifyUser.id});

            if (!user) {
                await UserModel.create({
                    name: spotifyUser.id,
                    createdAt: new Date(Date.now()),
                    lastLoggedIn: new Date(Date.now()),
                });
                res.status(201).json({ code: 201, message: 'User registered!' });
                return;
            } else {
                await user.updateOne({lastLoggedIn: new Date(Date.now())});
                res.status(200).json({ code: 200, message: 'User logged in!' });
                return;
            }
        } catch (e) {
            this.logger.error((e as Error).message);
            throw new Error('Error identifying/creating user');
        }
    }
}