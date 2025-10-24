import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', params.username)
      .single();
    
    if (error || !data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('username', params.username);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
