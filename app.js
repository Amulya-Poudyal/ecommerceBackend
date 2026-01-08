import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { db } from './db/index.ts';
import { apiReference } from '@scalar/express-api-reference';
import { openApiSpec } from './openapi.js';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send("This is the default route!");
})
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/brands', brandRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/admin', adminRoutes);

app.use('/docs', apiReference(
    {
        spec:
        {
            content: openApiSpec,
        },
    }),
);

(async () => {
    try {
        await db.execute('select 1');
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed', error);
    }
})();
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
