/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as ItemService from "./items.service";
import { BaseItem, Item } from "./item.interface";
import { AppDataSource } from "../data-source";
import { Photo } from "../entity/Photo";
import { validate } from "class-validator";
import { Ve } from "../entity/Ve";
import { Khachhang } from "../entity/Khachhang";
import { Ghe } from "../entity/Ghe";
import { Phong } from "../entity/Phong";
import { Lichchieu } from "../entity/Lichchieu";
import { Rap } from "../entity/Rap";
import { Phim } from "../entity/Phim";
import { MoreThan, getRepository } from "typeorm";


//

//validate
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
/**
 * Controller Definitions
 */
//


//
//----------------------------------vé---------------------
//trang quan ly ve
itemsRouter.get("/dsve", async (req: Request, res: Response) => {
  try {
    const items= await AppDataSource.manager.find(Ve);
    res.render("items/ve",{list:items});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//trang them ve
itemsRouter.get("/addve", async (req: Request, res: Response) => {
  try {

    const items= await AppDataSource.manager.find(Khachhang);

    const ghedoichua = await AppDataSource.manager.createQueryBuilder(Ghe, "ghe")
    .where("ghe.idghe NOT IN (SELECT idghe FROM Ve)")
    .getMany();

    return res.render("items/addve", {list:items,list2:ghedoichua,message:"null"});


  } catch (e) {
    res.status(500).send(e.message);
  }
});
//them ve
itemsRouter.post("/createve", async (req: Request, res: Response) => {
  try {
    const ve = new Ve()
    ve.idkh = req.body.idkh;
    ve.idghe =req.body.idghe;
    await AppDataSource.manager.save(ve);
    res.redirect('/api/menu/items/dsve');
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
    .where("ghe.idghe NOT IN (SELECT idghe FROM Ve)")
    .getMany();
    //
  return res.render("items/editve", { list:items,list2:ghedoichua,list3: [item],message:"null"});
    
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
    veToUpdate.idkh = req.body.idkh;
    veToUpdate.idghe =req.body.idghe;
    await veRepository.save(veToUpdate)
    res.redirect('/api/menu/items/dsve');
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
    const items= await AppDataSource.manager.find(Ghe);
    res.render("items/ghe",{list:items});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//trang them ghe
itemsRouter.get("/addghe", async (req: Request, res: Response) => {
  try {

    const items= await AppDataSource.manager.find(Phong);


    return res.render("items/addghe", {list:items,message:"null"});


  } catch (e) {
    res.status(500).send(e.message);
  }
});
//them ghe
itemsRouter.post("/createghe", async (req: Request, res: Response) => {
  try {
    const ghe = new Ghe(); 

    ghe.tenghe = req.body.tenghe;
    ghe.idphong = req.body.idphong;
    ghe.giaghe = req.body.giaghe;
    await AppDataSource.manager.save(ghe);

    res.redirect('/api/menu/items/dsghe');
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
  return res.render("items/editghe", { list:[item],list2:items,message:"null"});
    
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
    gheToUpdate.idphong =req.body.idphong;
    gheToUpdate.giaghe =req.body.giaghe;
    await gheRepository.save(gheToUpdate)
    res.redirect('/api/menu/items/dsghe');
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
    const items= await AppDataSource.manager.find(Lichchieu);
    res.render("items/lichchieu",{list:items});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//trang them ve
itemsRouter.get("/addlichchieu", async (req: Request, res: Response) => {
  try {

    const item1= await AppDataSource.manager.find(Rap);
    const item2= await AppDataSource.manager.find(Phim);

    return res.render("items/addlichchieu", {list:item1,list2:item2,message:"null"});


  } catch (e) {
    res.status(500).send(e.message);
  }
});
//them lichchieu
itemsRouter.post("/createlichchieu", async (req: Request, res: Response) => {
  try {
    const lichchieu = new Lichchieu()
    lichchieu.idrap = req.body.idrap;
    lichchieu.idphim =req.body.idphim;
    lichchieu.ngaychieu = req.body.ngaychieu;
    lichchieu.giochieu =req.body.giochieu;
    lichchieu.gioketthuc = req.body.gioketthuc;
    await AppDataSource.manager.save(lichchieu);
    res.redirect('/api/menu/items/dslichchieu');
  } catch (e) {
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
    const item2= await AppDataSource.manager.find(Rap);
    const item3= await AppDataSource.manager.find(Phim);

  return res.render("items/editlichchieu", { list:item2,list2:item3,list3: [item],message:"null"});
    
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
    lichchieuToUpdate.idrap = req.body.idrap;
    lichchieuToUpdate.idphim =req.body.idphim;
    lichchieuToUpdate.ngaychieu = req.body.ngaychieu;
    lichchieuToUpdate.giochieu =req.body.giochieu;
    lichchieuToUpdate.gioketthuc = req.body.gioketthuc;
    await lichchieuRepository.save(lichchieuToUpdate)
    res.redirect('/api/menu/items/dslichchieu');
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
            //Đặt vé:
  itemsRouter.get("/datve/:id", async (req: Request, res: Response) => {
    const idphim: number = parseInt(req.params.id, 10);
    try {
      const item = await AppDataSource.manager.findOneOrFail(Phim, { where: { idphim } });
  
      //
    return res.render("items/Dat_ve", { list:[item],message:"null"});
      
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  //Chọn vé: chọn ngày chiếu - với id phim 
  itemsRouter.get("/chonve/:id", async (req: Request, res: Response) => {
    const idphim: number = parseInt(req.params.id, 10);
    try {
      const lichchieuRepository = AppDataSource.getRepository(Lichchieu);
      const currentDate = new Date();
      const item = await lichchieuRepository.query(`
        SELECT DISTINCT DATE_FORMAT(lichchieu.ngaychieu, '%Y-%m-%d') as ngaychieu
        FROM Lichchieu lichchieu
        WHERE lichchieu.ngaychieu > ?
          AND lichchieu.idphim = ?
      `, [currentDate, idphim]);
      
    return res.render("items/chonVe", { list:item,iphim:idphim,message:"null"});
      
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  //Chọn vé: chọn nơi chiếu - với id phim và ngày chiếu
  itemsRouter.post("/chonve2", async (req: Request, res: Response) => {
    try {
      const idphimz=req.body.idphim;
      const ngaychieuz=req.body.ngaychieu;
      //
      const lichchieuRepository = AppDataSource.getRepository(Rap);
      const query = `
      SELECT DISTINCT Rap.diachi 
      FROM Rap 
      WHERE Rap.idrap IN (
        SELECT DISTINCT Lichchieu.idrap
        FROM Lichchieu
        WHERE Lichchieu.idphim = ?
          AND Lichchieu.ngaychieu = ?
      )
    `;
    const items = await lichchieuRepository.query(query, [idphimz, ngaychieuz]);
      //
    return res.render("items/chonVe2", { list:items,iphim:idphimz,nchieu:ngaychieuz,message:"null"});
      
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  //Chọn vé: chọn giờ chiếu - với nơi chiếu, id phim và ngày chiếu
  itemsRouter.post("/chonve3", async (req: Request, res: Response) => {
    try {
      const idphimz=req.body.idphim;
      const ngaychieuz=req.body.ngaychieu;
      const diachiz=req.body.diachi;
      //
      const lichchieuRepository = AppDataSource.getRepository(Lichchieu);
      const query = `
    SELECT DISTINCT Lichchieu.giochieu
    FROM Lichchieu
    INNER JOIN Rap ON Lichchieu.idrap = Rap.idrap
    WHERE Lichchieu.idphim = ?
      AND Lichchieu.ngaychieu = ?
      AND Rap.diachi = ?
    GROUP BY Lichchieu.giochieu
  `;
const items = await lichchieuRepository.query(query, [idphimz, ngaychieuz, diachiz]);
      //
    return res.render("items/chonVe3", { list:items,dchi:diachiz,iphim:idphimz,nchieu:ngaychieuz,message:"null"});
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  //Chọn vé: chọn ghế - với giờ chiếu, nơi chiếu, id phim và ngày chiếu

  itemsRouter.post("/chonve4", async (req: Request, res: Response) => {
    try {
      const idphimz=req.body.idphim;
      const ngaychieuz=req.body.ngaychieu;
      const diachiz=req.body.diachi;
      const giochieuz=req.body.giochieu;

      //
      const lichchieuRepository = AppDataSource.getRepository(Ghe);
      const query = `
    SELECT DISTINCT Ghe.*
    FROM Ghe
    INNER JOIN Phong ON Ghe.idphong = Phong.idphong
    INNER JOIN Lichchieu ON Phong.idrap = Lichchieu.idrap
    INNER JOIN Rap ON Lichchieu.idrap = Rap.idrap
    WHERE Lichchieu.idphim = ?
      AND Lichchieu.ngaychieu = ?
      AND Lichchieu.giochieu = ?
      AND Rap.diachi = ?
      AND NOT EXISTS (
          SELECT * FROM Ve
          WHERE Ve.idghe = Ghe.idghe
      )
  `;
  const items = await lichchieuRepository.query(query, [idphimz, ngaychieuz, giochieuz, diachiz]);
      //
    return res.render("items/chonVe4", { list:items,message:"null"});
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  //đặt ghế
  
itemsRouter.post("/datghe", async (req: Request, res: Response) => {
  try {
    const ve = new Ve(); 
    ve.idghe = req.body.idghe;
    ve.idkh = req.body.idkh;//cansua
    await AppDataSource.manager.save(ve);

    //res.redirect('/api/menu/items/dsghe');
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//--------------------------------------------------
itemsRouter.get("/addd", async (req: Request, res: Response) => {
  try {

    return res.render("items/add", {message:"null"});

  } catch (e) {
    res.status(500).send(e.message);
  }
});
// GET items

itemsRouter.get("/", async (req: Request, res: Response) => {
    try {
      //const items: Item[] = await ItemService.findAll();
  
      //res.status(200).send(items);
      
      //list dung fo duyet item
      //get tu entiy
      //cach 1
      const items= await AppDataSource.manager.find(Photo);
      res.render("items/ds",{list:items,title:"Danh sach foody"});
      //cach 2 getrepostiyy
      //cach 3 create builder
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  
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
  
  //them
  itemsRouter.post("/them", async (req: Request, res: Response) => {
    try {
      const photo = new Photo()
      photo.name = req.body.name;
      photo.description =req.body.description;
      photo.filename = req.body.filename;
      const views = parseFloat(req.body.views);
      photo.views = views;
      photo.isPublished = req.body.isPublished;
      const errors = await validate(photo)
      if (errors.length > 0) {
        return res.render("items/add", { message:"Phải nhập đúng và đầy đủ ký tự"});
      } else {
          await AppDataSource.manager.save(photo);
          res.redirect('/api/menu/items');
      }
      
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  //

  //sua
  itemsRouter.get("/edit/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
      // tìm kiếm đối tượng Photo theo id
    const item = await AppDataSource.manager.findOneOrFail(Photo, { where: { id } });

    // Trả về đối tượng đó cho items/ds
    return res.render("items/edit", { list: [item],message:"null"});
      
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  //update:
  itemsRouter.put("/update/:id", async (req: Request, res: Response) => {
    const idz: number = parseInt(req.params.id, 10);
    try {
      
      const photoRepository = AppDataSource.getRepository(Photo)
      const photoToUpdate = await photoRepository.findOneBy({
          id: idz,
      })
      photoToUpdate.name = req.body.name;
      photoToUpdate.description =req.body.description;
      photoToUpdate.filename = req.body.filename;
      const views = parseFloat(req.body.views);
      photoToUpdate.views = views;
      photoToUpdate.isPublished = req.body.isPublished;

      const errors = await validate(photoToUpdate)
      if (errors.length > 0) {
        return res.render("items/edit", { list: [photoToUpdate],message:"Phải nhập đúng và đầy đủ ký tự"});

      } else {
          await photoRepository.save(photoToUpdate)
          res.redirect('/api/menu/items');
      }
      

    } catch (e) {
      res.status(500).send(e.message);
    }
  });
  // POST items
  
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
   
  itemsRouter.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
      const idz: number = parseInt(req.params.id, 10);
      const photoRepository = AppDataSource.getRepository(Photo)
      const photoToRemove = await photoRepository.findOneBy({
          id: idz,
      })
      await photoRepository.remove(photoToRemove)
      res.redirect('/api/menu/items');

    } catch (e) {
      res.status(500).send(e.message);
    }
  });
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

