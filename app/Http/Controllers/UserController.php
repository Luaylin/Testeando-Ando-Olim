<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;

class UserController extends Controller
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
        if($request->hasProfilePhoto){
            //Actualiza la foto de perfil
            //Valida si hay la foto
            if ($request -> hasFile('photo')){
                $file = $request->file('photo');
                $destination = 'profile_photos/';
                $filename = time()."-".$file->getClientOriginalName();
                $uploadSuccess = $request->file('photo')->move($destination, $filename);
                //Actualiza el registro en la base de datos
                $user = User::find($request->user);
                $user->profile_img = $destination . $filename;
                $user->save();
                return response()->json("Imagen actualizada correctamente, refresque la pagina", 200);
            } else {
                return response()->json(null, 404);
            }
        } else {
            if($request->hasVideo){
                //Sube el video
                if ($request -> hasFile('video')){
                    $file = $request->file('video');
                    $destination = 'videos/';
                    $filename = time()."-".$file->getClientOriginalName();
                    $uploadSuccess = $request->file('video')->move($destination, $filename);
                    //Registra en la base de datos
                    $post = new Post();
                    $post->content = $request->content;
                    $post->has_video = $request->hasVideo;
                    $post->video = $destination . $filename;
                    $post->user_id = $request->user;
                    $post->save();
                    return response()->json("Post subido correctamente, refresque la pagina", 200);
                } else {
                    return response()->json(null, 404);
                }
            } else{
                //Solo es una publicación de texto
                $post = new Post();
                $post->content = $request->content;
                $post->has_video = false;
                $post->user_id = $request->user;
                $post->save();
                return response()->json("Post subido correctamente, refresque la pagina", 200);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        $user = User::find($id);
        return $request;
        $file = $request->profile_img;
        $destination = 'profiles_img/';
        $filename = time()."-".$file->getClientOriginalName();
        $uploadSuccess = $file->move(public_path($destination), $filename);
        $user->profile_img = $destination.$filename;
        $user->save();
        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
