<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\College;
use Illuminate\Support\Facades\DB;

class CollegeUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = User::find($request->user);
        $user->colleges()->attach([$request->college => ['course'=>$request->course, 'start_date'=>$request->start_date, 'continue'=>$request->continue, 'end_date' =>$request->end_date]]);
        return response()->json($user->colleges, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);
        $colleges = College::all();
        $pivot = DB::table('college_user')->where('user_id', '=', $id)->get();
        return response()->json(["user"=>$user, "colleges"=>$colleges, "pivot"=>$pivot]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        $user->colleges()->detach([$request->pivot]);
        return response()->json($user, 200);
    }
}
