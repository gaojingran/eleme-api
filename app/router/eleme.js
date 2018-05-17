
const express = require('express')
const axios = require('axios')
const pick = require('object.pick')

const { queryString, formatImageUrl, formatArrayQuery } = require('../utils')
const router = express.Router()

const baseUrl = 'https://h5.ele.me/restapi'

const request = (method, url, cookie = "", data = {}, params = {}) => {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      data,
      params,
      headers: {
        Cookie: cookie
      },
    }).then(data => {
      resolve(data)
    }).catch(err => {
      const errmsg = err.response.data.message || err.toString()
      reject(errmsg)
    })
  })
}

/**
 * 获取验证码
 * {
 *   mobile: '',
 *   captcha_hash: '',
 *   captcha_value: '',
 * }
 */
router.post('/mobile_send_code', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  request(
    'POST',
    `${baseUrl}/eus/login/mobile_send_code`,
    cookie,
    req.body.data
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 手机登陆
 * {
 *   mobile: '',
 *   validate_code: '',
 *   validate_token: '',
 * }
 */
router.post('/login_by_mobile', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  request(
    'POST',
    `${baseUrl}/eus/login/login_by_mobile`,
    cookie,
    req.body.data
  ).then(data => {
    let cookie = data.headers['set-cookie'];
    cookie = cookie && cookie.map(x => x.replace("Domain=.ele.me", ""))
    res.set({
      'Set-Cookie': cookie
    })
    res.json({
      result: data.data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 *  获取用户信息
 *  https://h5.ele.me/restapi/eus/v1/users/28057714
 */
router.get('/users', (req, res, next) => {
  const { USERID } = req.cookies
  const cookie = req.get('Cookie') || ''
  request(
    'GET',
    `${baseUrl}/eus/v1/users/${USERID}`,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取地址
 * https://h5.ele.me/restapi/member/v1/users/28057714/addresses
 */

router.get('/address', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    "GET",
    `${baseUrl}/member/v1/users/${USERID}/addresses `,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 删除地址
 * https://h5.ele.me/restapi/member/v1/users/28057714/addresses/177510931
 */
router.get('/del_address', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    "DELETE",
    `${baseUrl}/member/v1/users/${USERID}/addresses/${req.query.id}`,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: true,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 新增地址
 * https://h5.ele.me/restapi/member/v1/users/28057714/addresses
 * {
 *  address:,
 *  address_detail:,
 *  name:,
 *  phone,
 *  poi_type:,
 *  sex,
 *  st_geohash,
 *  tag_type,
 * }
 */
router.post('/add_address', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    "POST",
    `${baseUrl}/member/v1/users/${USERID}/addresses`,
    cookie,
    req.body.data
  ).then(({ data }) => {
    res.json({
      result: true,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 更新地址
 * https://h5.ele.me/restapi/member/v1/users/28057714/addresses/2500372789992014
 */
router.post('/update_address', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    'PUT',
    `${baseUrl}/member/v1/users/${USERID}/addresses/${req.body.data.id}`,
    cookie,
    req.body.data
  ).then(({ data }) => {
    res.json({
      result: true,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 *  获取红包列表
 *  https://h5.ele.me/restapi/promotion/v3/users/28057714/hongbaos?offset=0&limit=20
 */

router.get('/hongbaos', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    "GET",
    `${baseUrl}/promotion/v3/users/${USERID}/hongbaos`,
    cookie,
    {},
    req.query
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 *  根据经纬度获取附近地址
 *  https://h5.ele.me/restapi/bgs/poi/search_poi_nearby
 *  {
 *    keyword,
 *    offset,
 *    limit,
 *    longitude,
 *    latitude,
 *  }
 */
router.get('/search_nearby', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    'GET',
    `${baseUrl}/bgs/poi/search_poi_nearby`,
    cookie,
    {},
    req.query
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取订单
 * {
 *  limit,
 *  offset,
 * }
 */
router.get('/orders', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    'GET',
    `${baseUrl}/bos/v2/users/${USERID}/orders?${queryString(req.query)}`,
    cookie,
  ).then(({ data }) => {
    const result = data.map(v => ({
      ...v,
      restaurant_image_path: formatImageUrl(v.restaurant_image_hash)
    }))
    res.json({
      result,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 订单信息
 * https://h5.ele.me/restapi/bos/v1/users/28057714/orders/3022848551327780017/snapshot
 */
router.get('/order-snapshot', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    'GET',
    `${baseUrl}/bos/v1/users/${USERID}/orders/${req.query.id}/snapshot`,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 订单描述
 * https://h5.ele.me/restapi/bos/v2/users/28057714/orders/3022848551327780017/distribution
 */
router.get('/order-desc', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  request(
    'GET',
    `${baseUrl}/bos/v2/users/${USERID}/orders/${req.query.id}/distribution`,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取商店食品列表
 * https://h5.ele.me/restapi/shopping/v2/menu?restaurant_id=156544579
 */

router.get('/restaurant_menu', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  request(
    'GET',
    `${baseUrl}/shopping/v2/menu?${queryString(req.query)}`,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取评价
 * https://h5.ele.me/restapi/ugc/v3/restaurants/156544579/ratings?has_content=true&offset=0&limit=8
 */
router.get('/restaurant_ratings', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const pickArray = ['has_content', 'offset', 'limit']
  let url = `${baseUrl}/ugc/v3/restaurants/${req.query.restaurant_id}/ratings?${pick(queryString(req.query), pickArray)}`
  req.query.tag_name ? url += `&tag_name=${encodeURIComponent(req.query.tag_name)}` : url += ''
  request(
    'GET',
    url,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 *  评价标签
 *  https://h5.ele.me/restapi/ugc/v2/restaurants/156031680/ratings/tags
 */
router.get('/rating_tags', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  request(
    'GET',
    `${baseUrl}/ugc/v2/restaurants/${req.query.restaurant_id}/ratings/tags`,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 评价分数
 * https://h5.ele.me/restapi/ugc/v2/restaurants/156031680/ratings/scores
 */
router.get('/rating_scores', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  request(
    'GET',
    `${baseUrl}/ugc/v2/restaurants/${req.query.restaurant_id}/ratings/scores`,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取单条商家信息
 * https://h5.ele.me/restapi/shopping/restaurant/156544579
 */
router.get('/restaurant_byid', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { restaurant_id } = req.query
  const pickArray = ['latitude', 'longitude', 'terminal']
  request(
    'GET',
    `${baseUrl}/shopping/restaurant/${restaurant_id}?${queryString(pick(req.query, pickArray))}&${formatArrayQuery(req.query.extras, 'extras')}`,
    cookie,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取入口菜单
 * req.query {latitude: xxxx, longitude: xxxx}
 */
router.get('/entry', (req, res, next) => {
  request(
    'GET',
    `${baseUrl}/shopping/openapi/entries?${queryString(req.query)}&templates[]=main_template`
  ).then(({ data }) => {
    let result = []
    if (data.length) {
      result = data[0].entries.map(v => ({
        ...v,
        image_url: formatImageUrl(v.image_hash)
      }))
    }
    res.json({
      result,
      code: 0
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取bannerEntry
 * req.query {latitude: xxxx, longitude: xxxx}
 */
router.get('/banner', (req, res, next) => {
  request(
    'GET',
    `${baseUrl}/shopping/v2/entries?${queryString(req.query)}&templates[]=big_sale_promotion_template`
  ).then(({ data }) => {
    let result = []
    if (data.length) {
      result = data[0].entries.map(v => ({
        ...v,
        image_url: formatImageUrl(v.image_hash)
      }))
    }
    res.json({
      result,
      code: 0
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 根据entry_id获取筛选类型
 * req.query {
 *             entry_id: 20004689
 *             longitude: 120.2659945
 *             latitude: 31.4702115
 *             terminal: h5
 *           }
 */
router.get('/food_sift_factors', (req, res, next) => {
  request(
    'GET',
    `${baseUrl}/shopping/v2/foods_page/sift_factors?${queryString(req.query)}`,
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0
    })
  }).then(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取全部筛选类型
 * https://h5.ele.me/restapi/shopping/v2/restaurant/category?latitude=31.46827&longitude=120.26996
 */
router.get('/total_category', (req, res, next) => {
  request(
    'GET',
    `${baseUrl}/shopping/v2/restaurant/category?${queryString(req.query)}`
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0
    })
  }).catch(err => {
    res.json({
      errmsg,
      code: 1,
    })
  })
})

/**
 * 获取筛选条件
 * https://h5.ele.me/restapi/shopping/v1/restaurants/filter-bar/attributes
 * ?latitude=31.46827&longitude=120.26996&terminal=h5
 */
router.get('/filter_attributes', (req, res, next) => {
  request(
    'GET',
    `${baseUrl}/shopping/v1/restaurants/filter-bar/attributes?${queryString(req.query)}`
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 * 获取商家列表
 * req.query {
 *             latitude,
 *             longitude,
 *             offset,
 *             limit,
 *             terminal: 'h5',
 *             extra_filters: 'home' || null,
 *             extras: [],
 *             rank_id,
 *             delivery_mode: [],
 *             activity_types: [],
 *             average_cost_ids [],
 *             support_ids: [],
 *             super_vip,
 *             order_by
 *             restaurant_category_ids: [] 类型数组
 *           }
 */

router.get('/restaurants', (req, res, next) => {
  const pickArray = ['latitude', 'longitude', 'limit', 'offset', 'terminal', 'rank_id', 'extra_filters', 'order_by', 'super_vip', 'keywords']
  const options = pick(req.query, ['delivery_mode', 'extras', 'restaurant_category_ids', 'activity_types', 'average_cost_ids', 'support_ids'])
  const tailUrl =  Object.keys(options).map(v => formatArrayQuery(req.query[v], v)).join('&')
  axios.get(`${baseUrl}/shopping/v3/restaurants
    ?${queryString(pick(req.query, pickArray))}]&${tailUrl}`)
  .then(({ data }) => {
    let result = []
    if (data.items.length) {
      result = data.items.map(({ restaurant }) => ({
        ...restaurant,
        image_url: formatImageUrl(restaurant.image_path),
        recommend: {
          ...restaurant.recommend,
          image_url: formatImageUrl(restaurant.recommend.image_hash),
        }
      }))
    }
    res.json({
      result: {
        ...data,
        items: result,
      },
      code: 0
    })
  }).catch(err => {
    const errmsg = err.response.data.message || err.toString()
    res.json({
      errmsg,
      code: 1,
    })
  })
})

/**
 * 获取商家列表 搜索
 * req.query {
 *             latitude,
 *             longitude,
 *             offset,
 *             limit,
 *             terminal: 'h5',
 *             extra_filters: 'home' || null,
 *             extras: [],
 *             rank_id,
 *             delivery_mode: [],
 *             activity_types: [],
 *             average_cost_ids [],
 *             support_ids: [],
 *             super_vip,
 *             order_by
 *             restaurant_category_ids: [] 类型数组
 *             search_item_type
 *             keyword
 *           }
 */
router.get('/restaurants_search', (req, res, next) => {
  const pickArray = ['latitude', 'longitude', 'limit', 'offset', 'terminal', 'rank_id', 'extra_filters', 'order_by', 'super_vip', 'search_item_type']
  const options = pick(req.query, ['delivery_mode', 'extras', 'restaurant_category_ids', 'activity_types', 'average_cost_ids', 'support_ids'])
  const tailUrl =  Object.keys(options).map(v => formatArrayQuery(req.query[v], v)).join('&')
  axios.get(`${baseUrl}/shopping/v2/restaurants/search?${queryString(pick(req.query, pickArray))}]&keyword=${encodeURIComponent(req.query.keyword)}&${tailUrl}`)
  .then(({ data }) => {
    let result = []
    try {
      if (data.inside["0"].restaurant_with_foods.length) {
        result = data.inside["0"].restaurant_with_foods.map(({ restaurant }) => ({
          ...restaurant,
          image_url: formatImageUrl(restaurant.image_path),
          recommend: {
            ...restaurant.recommend,
            image_url: formatImageUrl(restaurant.recommend.image_hash),
          }
        }))
      }
    } catch (err) {
      result = []
    }
    res.json({
      result,
      code: 0
    })
  }).catch(err => {
    const errmsg = err.response.data.message || err.toString()
    res.json({
      errmsg,
      code: 1,
    })
  })
})

/**
 * 推荐食物
 * https://h5.ele.me/restapi/shopping/v1/find/recommendation?
 * offset=20&limit=20
 * &rank_id=45f46a0d8bda4995b3b427a4f1b19b5b
 * &latitude=31.4702562&longitude=120.2659741
 * &user_id=28057714
*/
router.get('/recommendation', (req, res, next) => {
  const cookie = req.get('Cookie') || ''
  const { USERID } = req.cookies
  const params = {
    ...req.query,
    user_id: USERID,
  }
  request(
    'GET',
    `${baseUrl}/shopping/v1/find/recommendation`,
    cookie,
    {},
    params
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0,
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})

/**
 *  热门关键词
 *  https://h5.ele.me/restapi/shopping/v3/hot_search_words?latitude=31.472891&longitude=120.286636
 */
router.get('/hot_keywords', (req, res, next) => {
  request(
    'GET',
    `${baseUrl}/shopping/v3/hot_search_words?${queryString(req.query)}`
  ).then(({ data }) => {
    res.json({
      result: data,
      code: 0
    })
  }).catch(err => {
    res.json({
      errmsg: err,
      code: 1,
    })
  })
})


module.exports = router
