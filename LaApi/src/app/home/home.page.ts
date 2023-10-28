import { Component } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user:any
  users:any;
  posts:any;
  post:any={
    id:null,
    title:"",
    body:"",
    userId:null
  };

  constructor(private api: ApiServiceService , public alertController: AlertController) {}

  ionViewWillEnter(){
    this.getUsuarios();
    this.getPosts();
  }
  getUsuario(userId:number){
    this.api.getUser(userId).subscribe((data)=>{
      console.log(data)
      this.user=data;
    });
  }
  getUsuarios(){
    this.api.getUsers().subscribe((data)=>{
      this.users=data;
    });
  }

  getPosts(){
    this.api.getPosts().subscribe((res)=>{
      this.posts=res;
      this.posts.reverse();
    },(error)=>{ 
      console.log(error); 
  });
  }

  getPost(id:number){
    this.api.getPost(id).subscribe((data)=>{
      this.post=data;
    });
  }

  BorraPost(post:any){
    this.api.deletePost(post.id).subscribe((data)=>{
      this.post=data;
      console.log(data); 
      this.getPosts();
      this.presentAlert("Información","Post eliminado")
    },error=>{ 
      console.log(error); 
    });
  }

  createPost(){ 
    if(this.user==null){
      if(this.user==undefined){
        this.presentAlert("Error","Debe seleccionar un nombre de usuario")
      }else{
        this.post.userId=this.user.id;
        this.api.createPost(this.post).subscribe((success)=>{
          console.log(success); 
          this.limpiar();
          this.getPosts();
          this.presentAlert("Correcto","Post publicado")
        },error=>{ 
          console.log(error); 
        });
      }

    }else{
      this.api.updatePost(this.post.id,this.post).subscribe((data)=>{
        console.log(data); 
        this.limpiar();
        this.getPosts();
        this.presentAlert("Correcto","Post modificado")
      },error=>{ 
        console.log(error); 
      });
    }
  }


  compareWith:any;

  TraePost(poste:any){
    this.post=poste
    this.getUsuario(this.post.userId);
    //this.user=
    this.compareWith = this.compareWithFn;
  }

  limpiar(){
    //console.log(this.user);
    this.user=null;
    this.post.title=null;
    this.post.body=null;
  }

  compareWithFn = (o1:any, o2:any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  async presentAlert(titulo:string,message:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}




