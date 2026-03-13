import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const uploadDir = formData.get('uploadDir') as string || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define the directory
        const publicPath = join(process.cwd(), 'public', uploadDir);

        // Ensure directory exists
        try {
            await mkdir(publicPath, { recursive: true });
        } catch (error) {
            // Ignore error if directory already exists
        }

        // Clean filename and create unique name
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${Date.now()}-${originalName}`;
        const filePath = join(publicPath, filename);

        // Write the file
        await writeFile(filePath, buffer);

        // Return the public URL
        const fileUrl = `/${uploadDir}/${filename}`;

        return NextResponse.json({ 
            success: true, 
            url: fileUrl,
            message: 'File uploaded successfully'
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to upload file' 
        }, { status: 500 });
    }
}
