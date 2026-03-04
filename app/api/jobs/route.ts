import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const job = await prisma.job.create({
      data: {
        serviceType: body.serviceType,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || null,
        address: body.address || 'TBD',
        description: body.description || 'TBD',
        lat: 40.7128,
        lng: -74.0060,
        status: 'DRAFT',
        durationSecondsPurchased: body.serviceType === 'MINUTES_60' ? 3600 : 1800,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const job = await prisma.job.findUnique({
        where: { id },
        include: { tasker: true },
      });
      return NextResponse.json(job);
    }
    
    const jobs = await prisma.job.findMany();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
