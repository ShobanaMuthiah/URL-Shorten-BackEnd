import { nanoid } from 'nanoid';
import URL from '../Models/URL.js';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const generateShortUrl = async () => {
    let shortUrl;
    let isUnique = false;

    while (!isUnique) {
        // Generate a random string of 6 characters
        shortUrl = nanoid(6);

        // Check if the generated short URL is unique
        const existingUrl = await URL.findOne({ shortUrl });
        if (!existingUrl) {
            isUnique = true;
        }
    }

    return shortUrl;
};

export const createShortURL = async (req, res) => {
    const { originalUrl } = req.body;

    try {
        const shortUrl = await generateShortUrl();  // Ensure the function is awaited
        const url = new URL({ originalUrl, shortUrl, createdBy: req.user.id });
        await url.save();
        res.status(200).json({ shortUrl:shortUrl });
    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({message:'Server error'});
    }
};

export const redirectURL = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const url = await URL.findOne({ shortUrl });
        if (!url) return res.status(404).json({message:'URL not found.'});

        url.clickCount++;
        await url.save();

        res.redirect(url.originalUrl);
    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({message:'Server error'});
    }
};
