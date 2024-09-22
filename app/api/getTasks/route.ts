import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server'
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, response: NextApiResponse) {
 
    try {
      const client = await clientPromise;
      const db = client.db('AITasks');
      const items = await db.collection('Tasks').find({}).toArray();
      return NextResponse.json({ success: true, data: items });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: 'Failed to fetch items' });
    }

}


export async function POST(request: NextRequest, response: NextResponse) {

    try {
      const client = await clientPromise;
      const db = client.db('AITasks');
      const payload = await request.json();
      const { title, status } = payload;
      const result = await db.collection('Tasks').insertOne({  title, status });
      return NextResponse.json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: 'Failed to create item' });
    }
}

export async function PUT(request: NextRequest, response: NextResponse) {
  const { id, status } = await request.json();
  try {
    const client = await clientPromise;
    const db = client.db('AITasks');
    const result = await db.collection('Tasks').updateOne({_id: new ObjectId(id.toString())}, { $set: { status } });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error); 
    return NextResponse.json({ success: false, error: 'Failed to update item' });
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  const { id } = await request.json();
  try {
    const client = await clientPromise;
    const db = client.db('AITasks');
    const result = await db.collection('Tasks').deleteOne({_id: new ObjectId(id.toString())});
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to delete item' });
  }
}
