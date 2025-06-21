import express from 'express'
const router = express.Router()

import sequelize from '#configs/db.js'
import { QueryTypes } from 'sequelize'
const { Favorite } = sequelize.models

router.get('/', async function (req, res) {
  const id = req.params.id
  const posts = await sequelize.query(
    `
    SELECT event.*,
    favorites.*,
    member.*,
    event.event_id AS pid,
    member.id AS uid
    FROM \`favorites\`
    INNER JOIN \`event\`
    ON favorites.pid = event.event_id
    LEFT JOIN \`member\` ON favorites.uid = member.id;
   
    `,
    {
      //   replacements: { memberUid: id },
      type: QueryTypes.SELECT,
    }
  )

  // 標準回傳JSON
  return res.json({ status: 'success', data: { posts } })
})

//以uid為基礎查找
router.get('/:id', async (req, res) => {
  const id = req.params.id
  console.log('123', id)

  try {
    const posts = await sequelize.query(
      `
        SELECT event.*,
        favorites.*,
        member.*,
        event.event_id AS pid,
        member.id AS uid
        FROM \`favorites\`
        INNER JOIN \`event\`
        ON favorites.pid = event.event_id
        LEFT JOIN \`member\` ON favorites.uid = member.id
        WHERE favorites.uid = :uid;
        `,
      {
        replacements: { uid: id },
        type: QueryTypes.SELECT,
      }
    )

    // 標準回傳JSON
    return res.json({ status: 'success', data: { posts } })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

//新增
router.put('/:pid/:uid', async (req, res) => {
  const { pid, uid } = req.params

  const existFav = await Favorite.findOne({ where: { pid, uid } })
  if (existFav) {
    return res.json({ status: 'error', message: '資料已經存在，新增失敗' })
  }

  try {
    const newFavorite = await Favorite.create({ pid, uid })
    return res.status(201).json({ status: 'success', data: newFavorite })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

//刪除
router.delete('/:pid/:uid', async (req, res) => {
  const { pid, uid } = req.params
  const affectedRows = await Favorite.destroy({
    where: {
      pid,
      uid,
    },
  })

  // 沒有刪除到任何資料 -> 失敗或沒有資料被刪除
  if (!affectedRows) {
    return res.json({
      status: 'error',
      message: '刪除失敗',
    })
  }

  // 成功
  return res.json({ status: 'success', data: null })
})

export default router
