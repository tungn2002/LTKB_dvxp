/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as ItemService from "./items.service";
import { BaseItem, Item } from "./item.interface";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { Ve } from "../entity/Ve";
import { Khachhang } from "../entity/Khachhang";
import { Ghe } from "../entity/Ghe";
import { Phong } from "../entity/Phong";
import { Lichchieu } from "../entity/Lichchieu";
import { Phim } from "../entity/Phim";
import { User } from "../entity/User";
import { Brackets } from "typeorm";
//import * as session from 'express-session';



const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
//


/**
 * Router Definition
 */
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))
export const itemsRouter = express.Router();
//put
const methodOverride=require("method-override");
itemsRouter.use(methodOverride("_method"));
itemsRouter.use(cookieParser());
/**
 * Controller Definitions
 */
//

//

//************************************<= TRƯỜNG =>***************************************
// ============================================Trang chủ================================================
itemsRouter.get("/trangchu", async (req: Request, res: Response) => {
  try {
    // Số lượng bản ghi hiển thị trên mỗi trang
    const limit = 4;

    // Trang hiện tại
    const page = parseInt(req.query.page as string) || 1;

    // Tính toán vị trí bắt đầu và kết thúc của bản ghi
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Lấy danh sách vé đã mua từ cơ sở dữ liệu
    const items = await AppDataSource.manager.createQueryBuilder()
  .select("phim")
  .from(Phim, "phim")
  .where(`phim.idphim IN (SELECT DISTINCT idphim FROM lichchieu)`)
  .skip(startIndex)
  .take(limit)
  .getMany();



    // Tổng số bản ghi
    const total = items.length;

    // Số trang
    const totalPages = Math.ceil(total / limit);

    // Render trang EJS với danh sách vé, số trang và trang hiện tại
    return res.render("items/user/trangchu.ejs", { 
      list: items,
      totalPages,
      currentPage: page,
    });
    // const items = await AppDataSource.manager.query("SELECT * FROM phim");
    // //khi chạy trang chủ thì sẽ chuyền vào list. list này chưa ds phim
    // return res.render("items/user/trangchu.ejs", { list: items });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//========================Đăng nhập==================================================================================
itemsRouter.get("/dangnhap", async (req: Request, res: Response) => {
  try {
    res.render("items/user/login.ejs");
  } catch (e) {
    res.status(500).send(e.message);
  }
});
itemsRouter.post("/xulydangnhap", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password; 
  try {
    

    
    // Kiểm tra xem email và password có trong DB không

    const user = await AppDataSource.manager.findOne(User, { where: { email: email } });
    // const items = await AppDataSource.manager.query("SELECT * FROM phim");
    if (user && (await bcrypt.compare(password, user.password))) {//kiem tra xem nola admin hay la khach hang
      if(user.idql==null){
        // Nếu email và password trùng với DB thì cho phép đăng nhập
        const kh = await AppDataSource.manager.findOne(Khachhang, { where: { idkh: user.idkh} });
        const iduser= kh.idkh;
        res.cookie(`id`, iduser);
        res.redirect('/api/menu/items/trangchu');
        // return res.render("items/user/trangchu.ejs", { 
        //   list: items,
        //   totalPages,
        //   currentPage: page,
        // });
      }
      else{
        res.redirect('/api/menu/items/dsve');
      }
    } else {
      // Nếu không thì thông báo lỗi đăng nhập
      return res.render("items/user/login.ejs", { message: "Email hoặc mật khẩu không đúng."});
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//=================Đăng xuất===================================================================================
itemsRouter.get("/dangxuat", async (req: Request, res: Response) => {
  try {
    res.clearCookie('id');
    res.redirect('/api/menu/items/trangchu');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//=======================Đăng Ký=============================================================================
itemsRouter.get("/dangky", async (req: Request, res: Response) => {
  try {
    res.render("items/user/dangki.ejs");
  } catch (e) {
    res.status(500).send(e.message);
  }
});
itemsRouter.post("/xulydangky", async (req: Request, res: Response) => {
  try {
    const Khac = new Khachhang();
    const user = new User();
    Khac.tenkh = req.body.name;
    Khac.gioitinh = req.body.gioitinh;
    Khac.ngaysinh =  new Date(req.body.ngaysinh);
    Khac.sodienthoai = req.body.sdt;
    Khac.diachi = req.body.diachi;
    user.email = req.body.email;
    user.password = await bcrypt.hash(req.body.pass, 10);
    const errors = await validate(Khac)
    const errorss = await validate(user)
    if (errors.length > 0 || errorss.length>0) {
      return res.render("items/user/dangki.ejs");
    } else {
        await AppDataSource.manager.save(Khac);
        const results = await AppDataSource.manager.query("SELECT * FROM khachhang WHERE idkh = (SELECT MAX(idkh) FROM khachhang);");
        user.idkh = results[0].idkh;
        await AppDataSource.manager.save(user);
        res.redirect('/api/menu/items/dangnhap');
    }    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//=============Thông tin chung===================================================================================
itemsRouter.get("/thongtinchung", async (req: Request, res: Response) => {
  try {
    const id = req.cookies.id;
    const moment = require('moment');
    if (id){
      const results = await AppDataSource.manager.query(`SELECT * FROM khachhang WHERE idkh = ${id}`);
      const ns = moment(results[0].ngaysinh).format('DD/MM/YYYY');//ngày sinh của khách hàng
      //lịch sử giao dịch
      const ls = await AppDataSource.manager.query(`SELECT phim.tenphim, phong.tenphong, ghe.tenghe, ghe.giaghe, ve.ngaymua FROM ve LEFT JOIN ghe ON ve.idghe = ghe.idghe LEFT JOIN phong ON ghe.idphong = phong.idphong LEFT JOIN lichchieu ON lichchieu.idphong = phong.idphong LEFT JOIN phim ON phim.idphim = lichchieu.idphim WHERE ve.idkh = ${id};`);
      // for(let i=0; i<ls.length; i++){
      //   const nm = moment(ls[i].ngaymua).format('DD/MM/YYYY');
      //   return res.render("items/user/thongtinchung.ejs", { list:results, ngaysinh: ns, list2:ls, ngaymua:nm});
      // }
      const nm = [];
      for(let i=0; i<ls.length; i++){
        const t = moment(ls[i].ngaymua).format('DD/MM/YYYY');
        nm.push(t);
      }
      return res.render("items/user/thongtinchung.ejs", { list:results, ngaysinh: ns, list2:ls, ngaymua:nm});
    }
    else {
      return res.render("items/user/login.ejs");
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//========================================Đổi mật khẩu=====================================================================================
itemsRouter.get("/doimk", async (req: Request, res: Response) => {
  try {
    res.render("items/user/doimk.ejs");
  } catch (e) {
    res.status(500).send(e.message);
  }
});
itemsRouter.post("/xulydoimk", async (req: Request, res: Response) => {
  try {
    const id = req.cookies.id;
    const password = req.body.password;
    const password_new = req.body.password_new;
    const re_password = req.body.re_password;
    const user = await AppDataSource.manager.findOne(User, { where: { idkh: id } } );
    if (user && (await bcrypt.compare(password, user.password))) {
      if (password_new === re_password) {
        user.password = await bcrypt.hash(password_new, 10);
        await AppDataSource.manager.save(user);
        res.redirect('/api/menu/items/thongtinchung');
      } else {
        res.redirect('/api/menu/items/doimk?message=Nhập lại và mật khẩu mới không khớp');
      }
    } else {
      res.redirect('/api/menu/items/doimk?message=Mật khẩu hiện tại không đúng');
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
  res.render("items/user/doimk.ejs");
});

//=============Quản lý phim======================================================================
itemsRouter.get("/dsphim", async (req: Request, res: Response) => {
  try {
    // Số lượng bản ghi hiển thị trên mỗi trang
    const limit = 5;

    // Trang hiện tại
    const page = parseInt(req.query.page as string) || 1;

    // Tính toán vị trí bắt đầu và kết thúc của bản ghi
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Lấy danh sách vé đã mua từ cơ sở dữ liệu
    const items = await AppDataSource.manager.find(Phim, {
      skip: startIndex,
      take: limit,
    });

    // Tổng số bản ghi
    const total = await AppDataSource.manager.count(Phim);

    // Số trang
    const totalPages = Math.ceil(total / limit);

    // Render trang EJS với danh sách vé, số trang và trang hiện tại
    return res.render("items/phim.ejs", { 
      list: items,
      totalPages,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//=====trang thêm phim==========
itemsRouter.get("/addphim", async (req: Request, res: Response) => {
  try {
    res.render("items/addphim.ejs", {message:req.query.message || "null"});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//them phim
itemsRouter.post('/createphim', async (req: Request, res: Response) => {
  try {
    const phim = new Phim();
    phim.tenphim = req.body.name;
    phim.theloai = req.body.theloai;
    phim.noidung = req.body.noidung;
    phim.daodien = req.body.daodien; 
    phim.image = req.body.anh;
   

    const errors = await validate(phim);

    if (errors.length > 0) {
      res.redirect('/api/menu/items/addphim?message=Phải nhập đúng và đầy đủ ký tự');
    } else {
      await AppDataSource.manager.save(phim);
      res.redirect('/api/menu/items/dsphim');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

// itemsRouter.post("/createphim", async (req: Request, res: Response) => {
//   try {
//     const phim = new Phim()
//     phim.tenphim = req.body.name;
//     phim.theloai = req.body.theloai;
//     phim.noidung = req.body.noidung;
//     phim.daodien = req.body.daodien;

//     if (req.files && req.files.anh) {
//       const file = req.files.anh;
//       const fileName = Date.now() + '-' + file.name;
//       const filePath = 'public/anh/' + fileName;
//       file.mv(filePath, (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send(err);
//         } else {
//           phim.image = '/anh/' + fileName; // Lưu đường dẫn của file vào database
//           AppDataSource.manager.save(phim);
//           res.redirect('/api/menu/items/dsphim');
//         }
//       });
//     } else {
//       const errors = await validate(phim)
//       if (errors.length > 0) {
//         res.redirect('/api/menu/items/addphim?message=Phải nhập đúng và đầy đủ ký tự');
//       } else {
//         await AppDataSource.manager.save(phim);
//         res.redirect('/api/menu/items/dsphim');
//       }
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).send(e.message);
//   }
// });



//trang sửa phim
itemsRouter.get("/editphim/:id", async (req: Request, res: Response) => {
  const idphim: number = parseInt(req.params.id, 10);
  try {
    const item = await AppDataSource.manager.findOneOrFail(Phim, { where: { idphim } });
    //return res.render("items/editphim.ejs", { list:item, message:req.query.message || "null"});
    return res.render("items/editphim.ejs", { list :[item] , message:req.query.message || "null"});   
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//Sửa phim
itemsRouter.put("/updatephim/:id", async (req: Request, res: Response) => {
  const idz: number = parseInt(req.params.id, 10);
  try {
    
    const phimToUpdate = AppDataSource.getRepository(Phim)
    const phim = await phimToUpdate.findOneBy({
        idphim: idz,
    })
    phim.tenphim = req.body.name;
    phim.theloai = req.body.theloai;
    phim.noidung = req.body.noidung;
    phim.daodien = req.body.daodien;
    phim.image = req.body.anh;
    const errors = await validate(phim)
    if (errors.length > 0) {
      res.redirect('/api/menu/items/editphim/'+idz+'?message=Phải nhập đúng và đầy đủ ký tự');
    } else {
      await phimToUpdate.save(phim)
      res.redirect('/api/menu/items/dsphim');
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//xóa phim

itemsRouter.delete("/deletephim/:id", async (req: Request, res: Response) => {
  try {
    const idz: number = parseInt(req.params.id, 10);
    const phimRepository = AppDataSource.getRepository(Phim)
    const phimToRemove = await phimRepository.findOneBy({
        idphim: idz,
    })
    await phimRepository.remove(phimToRemove)
    res.redirect('/api/menu/items/dsphim');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//============Quản lý phòng==========================================================================================

itemsRouter.get("/dsphong", async (req: Request, res: Response) => {
  try {
    // Số lượng bản ghi hiển thị trên mỗi trang
    const limit = 5;

    // Trang hiện tại
    const page = parseInt(req.query.page as string) || 1;

    // Tính toán vị trí bắt đầu và kết thúc của bản ghi
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Lấy danh sách vé đã mua từ cơ sở dữ liệu
    const items = await AppDataSource.manager.find(Phong, {
      skip: startIndex,
      take: limit,
    });

    // Tổng số bản ghi
    const total = await AppDataSource.manager.count(Phong);

    // Số trang
    const totalPages = Math.ceil(total / limit);

    // Render trang EJS với danh sách vé, số trang và trang hiện tại
    return res.render("items/phong.ejs", { 
      list: items,
      totalPages,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//====trang thêm phòng=====
itemsRouter.get("/addphong", async (req: Request, res: Response) => {
  try {
    res.render("items/addphong.ejs", {message:req.query.message || "null"});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//them phong
itemsRouter.post("/createphong", async (req: Request, res: Response) => {
  try {
    const phong = new Phong()
    phong.tenphong = req.body.name;
    const errors = await validate(phong)
    if (errors.length > 0) {
      res.redirect('/api/menu/items/addphong?message=Phải nhập đúng và đầy đủ ký tự');
    } else {
      await AppDataSource.manager.save(phong);
      res.redirect('/api/menu/items/dsphong');
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//trang sửa phong
itemsRouter.get("/editphong/:id", async (req: Request, res: Response) => {
  const idphong: number = parseInt(req.params.id, 10);
  try {
    const item = await AppDataSource.manager.findOneOrFail(Phong, { where: { idphong } });
    //return res.render("items/editphim.ejs", { list:item, message:req.query.message || "null"});
    return res.render("items/editphong.ejs", { list :[item] , message:req.query.message || "null"});   
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//Sửa phong
itemsRouter.put("/updatephong/:id", async (req: Request, res: Response) => {
  const idz: number = parseInt(req.params.id, 10);
  try {
    
    const phimToUpdate = AppDataSource.getRepository(Phong)
    const phong = await phimToUpdate.findOneBy({
        idphong: idz,
    })
    phong.tenphong = req.body.name;
    const errors = await validate(phong)
    if (errors.length > 0) {
      res.redirect('/api/menu/items/editphong/'+idz+'?message=Phải nhập đúng và đầy đủ ký tự');
    } else {
      await phimToUpdate.save(phong)
      res.redirect('/api/menu/items/dsphong');
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//xóa phong

itemsRouter.delete("/deletephong/:id", async (req: Request, res: Response) => {
  try {
    const idz: number = parseInt(req.params.id, 10);
    const phongRepository = AppDataSource.getRepository(Phong)
    const phongToRemove = await phongRepository.findOneBy({
        idphong: idz,
    })
    await phongRepository.remove(phongToRemove)
    res.redirect('/api/menu/items/dsphong');
  } catch (e) {
    res.status(500).send(e.message);
  }
});


//************************************<= Tùng =>***************************************
//----------------------------------vé---------------------
//trang quan ly ve
itemsRouter.get("/dsve", async (req: Request, res: Response) => {
  try {
    // Số lượng bản ghi hiển thị trên mỗi trang
    const limit = 5;

    // Trang hiện tại
    const page = parseInt(req.query.page as string) || 1;

    // Tính toán vị trí bắt đầu và kết thúc của bản ghi
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Lấy danh sách vé đã mua từ cơ sở dữ liệu
    const items = await AppDataSource.manager.find(Ve, {
      skip: startIndex,
      take: limit,
    });

    // Tổng số bản ghi
    const total = await AppDataSource.manager.count(Ve);

    // Số trang
    const totalPages = Math.ceil(total / limit);

    // Render trang EJS với danh sách vé, số trang và trang hiện tại
    res.render("items/ve", {
      list: items,
      totalPages,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
/*
itemsRouter.get("/dsve", async (req: Request, res: Response) => {
  try {
    const items= await AppDataSource.manager.find(Ve);
    res.render("items/ve",{list:items});
  } catch (e) {
    res.status(500).send(e.message);
  }
});*/

//trang them ve
itemsRouter.get("/addve", async (req: Request, res: Response) => {
  try {

    const items= await AppDataSource.manager.find(Khachhang);

    const ghedoichua = await AppDataSource.manager.createQueryBuilder(Ghe, "ghe")
    .where("ghe.idghe NOT IN (SELECT idghe FROM Ve)")
    .getMany();

    return res.render("items/addve", {list:items,list2:ghedoichua,message:req.query.message || "null"});


  } catch (e) {
    res.status(500).send(e.message);
  }
});
//them ve
itemsRouter.post("/createve", async (req: Request, res: Response) => {
  try {
    const ve = new Ve()
    ve.idkh = parseInt(req.body.idkh, 10);
    ve.idghe =parseInt(req.body.idghe, 10);
    
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    ve.ngaymua=new Date(today);


    const errors = await validate(ve)
    if (errors.length > 0) {
      res.redirect('/api/menu/items/addve?message=Phải nhập đúng và đầy đủ ký tự');

    } else {
      await AppDataSource.manager.save(ve);
      res.redirect('/api/menu/items/dsve');
    }

    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//trang sua ve

itemsRouter.get("/editve/:id", async (req: Request, res: Response) => {
  const idve: number = parseInt(req.params.id, 10);
  try {
    //ve muon sua
  const item = await AppDataSource.manager.findOneOrFail(Ve, { where: { idve } });
    //
    const items= await AppDataSource.manager.find(Khachhang);
    

    const ghedoichua = await AppDataSource.manager.createQueryBuilder(Ghe, "ghe")
    .where("ghe.idghe NOT IN (SELECT idghe FROM Ve) OR ghe.idghe = :idghe", { idghe: item.idghe })
    .getMany();
    //
  return res.render("items/editve", { list:items,list2:ghedoichua,list3: [item],message:req.query.message || "null"});
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//sua ve


itemsRouter.put("/updateve/:id", async (req: Request, res: Response) => {
  const idz: number = parseInt(req.params.id, 10);
  try {
    
    const veRepository = AppDataSource.getRepository(Ve)
    const veToUpdate = await veRepository.findOneBy({
        idve: idz,
    })
    veToUpdate.idkh = parseInt(req.body.idkh, 10);
    veToUpdate.idghe =parseInt(req.body.idghe, 10);
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    veToUpdate.ngaymua=new Date(today);


    const errors = await validate(veToUpdate)
    if (errors.length > 0) {
      res.redirect('/api/menu/items/editve/'+idz+'?message=Phải nhập đúng và đầy đủ ký tự');

    } else {
      
      await veRepository.save(veToUpdate)
      res.redirect('/api/menu/items/dsve');
    }


  } catch (e) {
    res.status(500).send(e.message);
  }
});
//xoa ve

itemsRouter.delete("/deleteve/:id", async (req: Request, res: Response) => {
  try {
    const idz: number = parseInt(req.params.id, 10);
    const veRepository = AppDataSource.getRepository(Ve)
    const veToRemove = await veRepository.findOneBy({
        idve: idz,
    })
    await veRepository.remove(veToRemove)
    res.redirect('/api/menu/items/dsve');
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//-----------------------------------------------------------
//----------------------------------Ghế---------------------
//trang quan ly ghe
itemsRouter.get("/dsghe", async (req: Request, res: Response) => {
  try {
   // Số lượng bản ghi hiển thị trên mỗi trang
   const limit = 5;

   // Trang hiện tại
   const page = parseInt(req.query.page as string) || 1;

   // Tính toán vị trí bắt đầu và kết thúc của bản ghi
   const startIndex = (page - 1) * limit;
   const endIndex = page * limit;

   // Lấy danh sách vé đã mua từ cơ sở dữ liệu
   const items = await AppDataSource.manager.find(Ghe, {
     skip: startIndex,
     take: limit,
   });

   // Tổng số bản ghi
   const total = await AppDataSource.manager.count(Ghe);

   // Số trang
   const totalPages = Math.ceil(total / limit);

   // Render trang EJS với danh sách vé, số trang và trang hiện tại
   res.render("items/ghe", {
     list: items,
     totalPages,
     currentPage: page,
   });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
/*
itemsRouter.get("/dsghe", async (req: Request, res: Response) => {
  try {
    const items= await AppDataSource.manager.find(Ghe);
    res.render("items/ghe",{list:items});
  } catch (e) {
    res.status(500).send(e.message);
  }
});
*/
//trang them ghe
itemsRouter.get("/addghe", async (req: Request, res: Response) => {
  try {

    const items= await AppDataSource.manager.find(Phong);


    return res.render("items/addghe", {list:items,message:req.query.message || "null"});

  } catch (e) {
    res.status(500).send(e.message);
  }
});
//them ghe
itemsRouter.post("/createghe", async (req: Request, res: Response) => {
  try {
    const ghe = new Ghe(); 

    ghe.tenghe = req.body.tenghe;
    ghe.idphong = parseInt(req.body.idphong, 10);
    ghe.giaghe = parseFloat(req.body.giaghe);
    const errors = await validate(ghe)
    if (errors.length > 0) {
      res.redirect('/api/menu/items/addghe?message=Phải nhập đúng và đầy đủ ký tự');

    } else {
      await AppDataSource.manager.save(ghe);
      res.redirect('/api/menu/items/dsghe');
    }
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//trang sua ghe

itemsRouter.get("/editghe/:id", async (req: Request, res: Response) => {
  const idghe: number = parseInt(req.params.id, 10);
  try {
    const item = await AppDataSource.manager.findOneOrFail(Ghe, { where: { idghe } });
    const items= await AppDataSource.manager.find(Phong);


    //
  return res.render("items/editghe", { list:[item],list2:items,message:req.query.message || "null"});
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//sua ghe


itemsRouter.put("/updateghe/:id", async (req: Request, res: Response) => {
  const idz: number = parseInt(req.params.id, 10);
  try {
    
    const gheRepository = AppDataSource.getRepository(Ghe)
    const gheToUpdate = await gheRepository.findOneBy({
        idghe: idz,
    })
    gheToUpdate.tenghe = req.body.tenghe;
    gheToUpdate.idphong =parseInt(req.body.idphong, 10);
    gheToUpdate.giaghe =parseFloat(req.body.giaghe);

    const errors = await validate(gheToUpdate)
    if (errors.length > 0) {
      res.redirect('/api/menu/items/editghe/'+idz+'?message=Phải nhập đúng và đầy đủ ký tự');

    } else {
      await gheRepository.save(gheToUpdate)
      res.redirect('/api/menu/items/dsghe');
    }

    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//xoa ghe

itemsRouter.delete("/deleteghe/:id", async (req: Request, res: Response) => {
  try {
    const idz: number = parseInt(req.params.id, 10);
    const gheRepository = AppDataSource.getRepository(Ghe)
    const gheToRemove = await gheRepository.findOneBy({
        idghe: idz,
    })
    await gheRepository.remove(gheToRemove)
    res.redirect('/api/menu/items/dsghe');
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//-----------------------------------------------------------

//----------------------------------Lịch chiếu---------------------
//trang quan ly lichchieu
itemsRouter.get("/dslichchieu", async (req: Request, res: Response) => {
  try {
    // Số lượng bản ghi hiển thị trên mỗi trang
    const limit = 5;

    // Trang hiện tại
    const page = parseInt(req.query.page as string) || 1;

    // Tính toán vị trí bắt đầu và kết thúc của bản ghi
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Lấy danh sách vé đã mua từ cơ sở dữ liệu
    const items = await AppDataSource.manager.find(Lichchieu, {
      skip: startIndex,
      take: limit,
    });

    // Tổng số bản ghi
    const total = await AppDataSource.manager.count(Lichchieu);

    // Số trang
    const totalPages = Math.ceil(total / limit);

    // Render trang EJS với danh sách vé, số trang và trang hiện tại
    res.render("items/lichchieu", {
      list: items,
      totalPages,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
/*
itemsRouter.get("/dslichchieu", async (req: Request, res: Response) => {
  try {
    const items= await AppDataSource.manager.find(Lichchieu);
    res.render("items/lichchieu",{list:items});
  } catch (e) {
    res.status(500).send(e.message);
  }
});
*/
//trang them ve
itemsRouter.get("/addlichchieu", async (req: Request, res: Response) => {
  try {
    const item2= await AppDataSource.manager.find(Phim);
    const items = await AppDataSource.manager.query("SELECT phong.* FROM phong LEFT JOIN lichchieu ON phong.idphong = lichchieu.idphong WHERE lichchieu.idphong IS NULL;");
    //ko được lấy idphong đã có lịch chiếu
    //phòng dc trùng tên


    return res.render("items/addlichchieu", {list:items,list2:item2,message:req.query.message || "null"});


  } catch (e) {
    res.status(500).send(e.message);
  }
});
//them lichchieu

itemsRouter.post("/createlichchieu", async (req: Request, res: Response) => {
  try {
    
      const lichchieu = new Lichchieu()
      lichchieu.idphong =parseInt(req.body.idphong, 10);
      lichchieu.idphim =parseInt(req.body.idphim, 10);
      lichchieu.ngaychieu = new Date(req.body.ngaychieu);
      lichchieu.giochieu =req.body.giochieu;
      lichchieu.gioketthuc = req.body.gioketthuc;
      
      const errors = await validate(lichchieu)
      if (errors.length > 0) {      
        //res.redirect('/api/menu/items/addlichchieu?message=Trùng giờ chiếu');

        res.redirect('/api/menu/items/addlichchieu?message=Phải nhập đúng và đầy đủ ký tự');//+error.length neumuon hien so loi
      }
      else {
        await AppDataSource.manager.save(lichchieu);
        res.redirect('/api/menu/items/dslichchieu');
      }
    }
  catch (e) {
    res.status(500).send(e.message);
  }
  
});
//trang sua lichchieu

itemsRouter.get("/editlichchieu/:id", async (req: Request, res: Response) => {
  const idlichchieu: number = parseInt(req.params.id, 10);
  try {
    //lichchieu muon sua
  const item = await AppDataSource.manager.findOneOrFail(Lichchieu, { where: { idlichchieu } });
    //
    const item3= await AppDataSource.manager.find(Phim);
    const items= await AppDataSource.manager.find(Phong);


  return res.render("items/editlichchieu", {list:items,list2:item3,list3: [item],message:req.query.message || "null"});
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//sua lichchieu


itemsRouter.put("/updatelichchieu/:id", async (req: Request, res: Response) => {
  const idz: number = parseInt(req.params.id, 10);
  try {
    
    const lichchieuRepository = AppDataSource.getRepository(Lichchieu)
    const lichchieuToUpdate = await lichchieuRepository.findOneBy({
        idlichchieu: idz,
    })
    lichchieuToUpdate.idphim =parseInt(req.body.idphim, 10);
    lichchieuToUpdate.idphong =parseInt(req.body.idphong, 10);
    lichchieuToUpdate.ngaychieu = new Date(req.body.ngaychieu);
    lichchieuToUpdate.giochieu =req.body.giochieu;
    lichchieuToUpdate.gioketthuc = req.body.gioketthuc;
    const errors = await validate(lichchieuToUpdate)
    if (errors.length > 0) {
      res.redirect('/api/menu/items/editlichchieu/'+idz+'?message=Phải nhập đúng và đầy đủ ký tự');

    } else {
      await lichchieuRepository.save(lichchieuToUpdate)
        res.redirect('/api/menu/items/dslichchieu');
    }



  
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//xoa lichchieu

itemsRouter.delete("/deletelichchieu/:id", async (req: Request, res: Response) => {
  try {
    const idz: number = parseInt(req.params.id, 10);
    const lichchieuRepository = AppDataSource.getRepository(Lichchieu)
    const lichchieuToRemove = await lichchieuRepository.findOneBy({
        idlichchieu: idz,
    })
    await lichchieuRepository.remove(lichchieuToRemove)
    res.redirect('/api/menu/items/dslichchieu');
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//-----------------------------------------------------------
//Dat ve

itemsRouter.get("/datve/:id", async (req: Request, res: Response) => {
  // const idphim: number = parseInt(req.params.id, 10);
  const id = req.params.id;
  let idphim: number;

  if (isNaN(Number(id))) {
    // Đường dẫn URL không hợp lệ (không phải số)
    return res.redirect(`/api/menu/items/${id}`);
  }

  // Chuyển đổi `id` thành số
  idphim = Number(id);
  try {
    const item = await AppDataSource.manager.findOneOrFail(Phim, { where: { idphim } });

    // Trả về trang đặt vé với thông tin phim và form đặt vé
    return res.render("items/user/Dat_ve", { list:[item], message:"null" });
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Ngay chieu với idphim
itemsRouter.get("/ngaychieu/:id", async (req: Request, res: Response) => {
  // const id = req.params.id;
  // const idphim: number = isNaN(Number(id)) ? 0 : Number(id);
  // if (idphim === 0) {
  //   // Đường dẫn URL không hợp lệ (không chứa số)
  //   return res.redirect(`/api/menu/items/${idphim}`);
  // }
  const id = req.params.id;
  let idphim: number;

  if (isNaN(Number(id))) {
    // Đường dẫn URL không hợp lệ (không phải số)
    return res.redirect(`/api/menu/items/${id}`);
  }

  // Chuyển đổi `id` thành số
  idphim = Number(id);
  try {
    const id = req.cookies.id;
    if(id){
      //lay ngày chiếu duy nhất
      const results = await AppDataSource.manager.query("SELECT DISTINCT DATE_FORMAT(ngaychieu, '%Y-%m-%d') AS ngaychieu_formatted FROM Lichchieu WHERE idphim = ?",[idphim]);
      return res.render("items/user/chonVe", { iphim:idphim,list:results,message:"null"});
    }
    else{
      return res.redirect(`/api/menu/items/dangnhap`);
    }
    
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//chọn id và gio chiếu với ngày chiếu và idphim
itemsRouter.post("/giochieu", async (req: Request, res: Response) => {
  const idphim=req.body.idphim;
  const ngaychieu=req.body.ngaychieu;
  try {
    const results = await AppDataSource.manager.query("SELECT idlichchieu, giochieu FROM Lichchieu WHERE ngaychieu =? AND idphim = ?",[ngaychieu,idphim]);

    //
  return res.render("items/user/chonVe2", { list:results,message:"null"});
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//chọn ghe theo id gio chieu//lay ng dang danh nhap o localhost
itemsRouter.get("/chonghe/:id", async (req: Request, res: Response) => {
  // const idlichchieu: number = parseInt(req.params.id, 10);
  const id = req.params.id;
  let idlichchieu: number;

  if (isNaN(Number(id))) {
    // Đường dẫn URL không hợp lệ (không phải số)
    return res.redirect(`/api/menu/items/${id}`);
  }

  // Chuyển đổi `id` thành số
  idlichchieu = Number(id);

  try {
    //chon ghe voi idphong giong nhau giưa lịch chếu và ghế
    const results = await AppDataSource.manager.query("SELECT Ghe.idghe, Ghe.tenghe FROM Lichchieu JOIN Ghe ON Lichchieu.idphong = Ghe.idphong WHERE Lichchieu.idlichchieu = ?",[idlichchieu]);
    const results2 = await AppDataSource.manager.query("SELECT idghe FROM Ve");
    //
  return res.render("items/user/chonVe3", { list:results,list2:results2,message:"null"});
    
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//datve
itemsRouter.post("/datghe", async (req: Request, res: Response) => {
  try {
    const ve = new Ve()
    ve.idkh = parseInt(req.cookies.id, 10);
    ve.idghe =parseInt(req.body.idghe, 10);
    await AppDataSource.manager.save(ve);
    res.redirect('/api/menu/items/trangchu');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//thongke
itemsRouter.get("/thongke", async (req: Request, res: Response) => {
  try {
    const items= await AppDataSource.manager.find(Phim);

    return res.render("items/thongkedoanhthu", {list:items});

  } catch (e) {
    res.status(500).send(e.message);
  }
});
//thong ke all
itemsRouter.get("/thongkeall", async (req: Request, res: Response) => {
  try {
    // Số lượng bản ghi hiển thị trên mỗi trang
    const limit = 5;

    // Trang hiện tại
    const page = parseInt(req.query.page as string) || 1;

    // Tính toán vị trí bắt đầu và kết thúc của bản ghi
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Lấy danh sách kết quả từ cơ sở dữ liệu
    //lấy doanh thu của phim từ lichchieu ,với tổng số vé và tổng số giaghe
    const results = await AppDataSource.manager.query("SELECT phim.idphim, phim.tenphim, SUM(ghe.giaghe) AS tongdoanhthu, COUNT(ve.idve) AS tongsove FROM phim INNER JOIN lichchieu ON phim.idphim = lichchieu.idphim INNER JOIN ghe ON ghe.idphong = lichchieu.idphong INNER JOIN ve ON ve.idghe = ghe.idghe GROUP BY phim.idphim, phim.tenphim");

    // Tổng số bản ghi
    const total = results.length;

    // Số trang
    const totalPages = Math.ceil(total / limit);

    // Hiển thị danh sách kết quả trên trang hiện tại
    const items = results.slice(startIndex, endIndex);
    res.render("items/thongkedoanhthuall", {
      list: items,
      totalPages,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
/*
itemsRouter.get("/thongkeall", async (req: Request, res: Response) => {
  try {
    const results = await AppDataSource.manager.query("SELECT phim.idphim, phim.tenphim, SUM(ghe.giaghe) AS tongdoanhthu, COUNT(ve.idve) AS tongsove FROM phim INNER JOIN lichchieu ON phim.idphim = lichchieu.idphim INNER JOIN ghe ON ghe.idphong = lichchieu.idphong INNER JOIN ve ON ve.idghe = ghe.idghe GROUP BY phim.idphim, phim.tenphim");

    return res.render("items/thongkedoanhthuall", {list:results});

  } catch (e) {
    res.status(500).send(e.message);
  }
});*/
//thongketk
itemsRouter.post("/thongketk", async (req: Request, res: Response) => {
  try {
    
    const ngayA = req.body.date1; // Ngay A truyen tu client
    const ngayB = req.body.date2; // Ngay B truyen tu client
    const maPhim = req.body.idphim; // Ma phim truyen tu client
    //doanh thu theo ngày chiếu
    const results = await AppDataSource.manager.query(`
      SELECT lichchieu.ngaychieu, SUM(ghe.giaghe) AS tongdoanhthu 
      FROM lichchieu 
      INNER JOIN ghe ON ghe.idphong = lichchieu.idphong 
      INNER JOIN ve ON ve.idghe = ghe.idghe 
      WHERE lichchieu.idphim = ${maPhim} AND lichchieu.ngaychieu BETWEEN '${ngayA}' AND '${ngayB}'
      GROUP BY lichchieu.ngaychieu
    `);

    const limit = 5; // Số lượng bản ghi hiển thị trên mỗi trang
    const page = parseInt(req.query.page as string) || 1; // Trang hiện tại
    const startIndex = (page - 1) * limit; // Vị trí bắt đầu của bản ghi trên trang hiện tại
    const endIndex = page * limit; // Vị trí kết thúc của bản ghi trên trang hiện tại
    const total = results.length; // Tổng số bản ghi
    const totalPages = Math.ceil(total / limit); // Số trang
    const items = results.slice(startIndex, endIndex);
     // Danh sách kết quả trên trang hiện tại

    return res.render("items/thongkedoanhthutk", {
      list: items,
      totalPages,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
/*
itemsRouter.post("/thongketk", async (req: Request, res: Response) => {
  try {
    const ngayA = req.body.date1; // Ngay A truyen tu client
    const ngayB = req.body.date2; // Ngay B truyen tu client
    const maPhim = req.body.idphim; // Ma phim truyen tu client

    const results = await AppDataSource.manager.query(`
      SELECT lichchieu.ngaychieu, SUM(ghe.giaghe) AS tongdoanhthu 
      FROM lichchieu 
      INNER JOIN ghe ON ghe.idphong = lichchieu.idphong 
      INNER JOIN ve ON ve.idghe = ghe.idghe 
      WHERE lichchieu.idphim = ${maPhim} AND lichchieu.ngaychieu BETWEEN '${ngayA}' AND '${ngayB}'
      GROUP BY lichchieu.ngaychieu
    `);

    return res.render("items/thongkedoanhthutk", {list:results});

  } catch (e) {
    res.status(500).send(e.message);
  }
});
*/

itemsRouter.get("/addd", async (req: Request, res: Response) => {
  try {

    return res.render("items/add", {message:"null"});

  } catch (e) {
    res.status(500).send(e.message);
  }
});
// GET items

  
  // GET items/:id
  
  itemsRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
  
    try {
      const item: Item = await ItemService.find(id);
  
      if (item) {
        return res.status(200).send(item);
      }
  
      res.status(404).send("item not found");
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  itemsRouter.post("/", async (req: Request, res: Response) => {
    try {
      
      const item: BaseItem = req.body;
  
      const newItem = await ItemService.create(item);
  
      res.status(201).json(newItem);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  
  // PUT items/:id
  
  itemsRouter.put("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
  
    try {
      const itemUpdate: Item = req.body;
  
      const existingItem: Item = await ItemService.find(id);
  
      if (existingItem) {
        const updatedItem = await ItemService.update(id, itemUpdate);
        return res.status(200).json(updatedItem);
      }
      
      const newItem = await ItemService.create(itemUpdate);
  
      res.status(201).json(newItem);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  
  //xoa

  // DELETE items/:id
  
  itemsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      await ItemService.remove(id);
      
      res.sendStatus(204);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
//


