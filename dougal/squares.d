
function init(){
set(100, 1)
set(102, 1)
set(104, 1)
set(106, 1)
set(108, 5)
set(109, 126)
set(110, 3)
set(112, 1)
set(114, 1)
set(116, 1)
set(118, 1)
set(120, 1)
set(122, 4)
set(124, 2)
set(126, 6)
set(127, 108)
set(128, 3)
set(130, 5)
set(131, 148)
set(132, 4)
set(134, 1)
set(136, 1)
set(138, 1)
set(140, 1)
set(142, 1)
set(144, 3)
set(146, 2)
set(148, 6)
set(149, 130)
set(150, 1)
set(152, 4)
set(154, 1)
set(156, 5)
set(157, 480)
set(158, 3)
set(160, 5)
set(161, 176)
set(162, 3)
set(164, 1)
set(166, 3)
set(168, 1)
set(170, 4)
set(172, 4)
set(174, 2)
set(176, 6)
set(177, 160)
set(178, 1)
set(180, 1)
set(182, 3)
set(184, 3)
set(186, 5)
set(187, 200)
set(188, 4)
set(190, 4)
set(192, 1)
set(194, 3)
set(196, 3)
set(198, 2)
set(200, 6)
set(201, 186)
set(202, 3)
set(204, 3)
set(206, 3)
set(208, 5)
set(209, 212)
set(210, 2)
set(212, 6)
set(213, 208)
set(214, 1)
set(216, 1)
set(218, 3)
set(220, 5)
set(221, 224)
set(222, 2)
set(224, 6)
set(225, 220)
set(226, 1)
set(228, 3)
set(230, 3)
set(232, 3)
set(234, 1)
set(236, 5)
set(237, 262)
set(238, 5)
set(239, 242)
set(240, 2)
set(242, 6)
set(243, 238)
set(244, 1)
set(246, 1)
set(248, 1)
set(250, 1)
set(252, 1)
set(254, 1)
set(256, 3)
set(258, 3)
set(260, 3)
set(262, 6)
set(263, 236)
set(264, 4)
set(266, 4)
set(268, 4)
set(270, 5)
set(271, 334)
set(272, 5)
set(273, 304)
set(274, 4)
set(276, 1)
set(278, 1)
set(280, 1)
set(282, 1)
set(284, 1)
set(286, 1)
set(288, 1)
set(290, 1)
set(292, 4)
set(294, 1)
set(296, 1)
set(298, 3)
set(300, 3)
set(302, 2)
set(304, 6)
set(305, 272)
set(306, 1)
set(308, 4)
set(310, 7)
set(312, 4)
set(314, 5)
set(315, 330)
set(316, 3)
set(318, 2)
set(320, 2)
set(322, 2)
set(324, 2)
set(326, 4)
set(328, 2)
set(330, 6)
set(331, 314)
set(332, 4)
set(334, 6)
set(335, 270)
set(336, 4)
set(338, 4)
set(340, 5)
set(341, 472)
set(342, 3)
set(344, 3)
set(346, 3)
set(348, 3)
set(350, 3)
set(352, 5)
set(353, 464)
set(354, 3)
set(356, 3)
set(358, 3)
set(360, 5)
set(361, 364)
set(362, 2)
set(364, 6)
set(365, 360)
set(366, 1)
set(368, 1)
set(370, 1)
set(372, 1)
set(374, 1)
set(376, 1)
set(378, 1)
set(380, 1)
set(382, 1)
set(384, 4)
set(386, 5)
set(387, 396)
set(388, 3)
set(390, 2)
set(392, 4)
set(394, 2)
set(396, 6)
set(397, 386)
set(398, 1)
set(400, 1)
set(402, 1)
set(404, 1)
set(406, 1)
set(408, 1)
set(410, 1)
set(412, 1)
set(414, 1)
set(416, 3)
set(418, 5)
set(419, 446)
set(420, 2)
set(422, 5)
set(423, 432)
set(424, 4)
set(426, 2)
set(428, 3)
set(430, 2)
set(432, 6)
set(433, 422)
set(434, 1)
set(436, 5)
set(437, 444)
set(438, 4)
set(440, 4)
set(442, 4)
set(444, 6)
set(445, 436)
set(446, 6)
set(447, 418)
set(448, 4)
set(450, 5)
set(451, 460)
set(452, 3)
set(454, 1)
set(456, 4)
set(458, 2)
set(460, 6)
set(461, 450)
set(462, 3)
set(464, 6)
set(465, 352)
set(466, 4)
set(468, 4)
set(470, 2)
set(472, 6)
set(473, 340)
set(474, 4)
set(476, 4)
set(478, 2)
set(480, 6)
set(481, 156)
set(482, 5)
set(483, 490)
set(484, 7)
set(486, 7)
set(488, 7)
set(490, 6)
set(491, 482)

  set(10, 98) // pc
  set(11, 10000) // data pointer

}

function step(){ 

  //update program counter:
  set(10, get(10) + 2)
  
  //execute instruction:
  set(get(11), get(get(11)) + !(get(get(10))-1))
  set(get(11), get(get(11)) - !(get(get(10))-2))
  
  set(11, get(11) + !(get(get(10))-3) )        
  set(11, get(11) - !(get(get(10))-4) )        

  set(10, get(10) + !(get(get(10))-5) * !get(get(11)) * ( get(get(10)+1) - get(10) ) )    
  set(10, get(10) + !(get(get(10))-6) * !!get(get(11)) * ( get(get(10)+1) - get(10) ) )   
  
  set(0, get(get(11)))
  //console.log(get(0), get(11), get(10), !(get(get(10))-7))
  write(!(get(get(10))-7))
  
  halt(!(get(get(10))))
  
}

