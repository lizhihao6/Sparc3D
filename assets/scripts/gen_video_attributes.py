uid_list = [
    "bumblebee_rotb_update",
    "saber_lily_-_distant_avalon_figure",
    "rx-0_full_armor_unicorn_gundam",
    "canon_at-1_retro_camera",
    "iss-_international_space_station",
    "objaverse_000-013_ae33b9cc47084c85a3ccfcc034761d02",
    "abo_B079V39Z25",
    "white_flower",
    "kyouko_kirigiri_figure_from_danganronpa",
    "project1necklace_final_model",
    "objaverse_000-002_768784fe68c04970b121ec7aabcf03e1",
    "objaverse_000-008_d94fb13604af437980a080951612310b",
    "objaverse_000-009_1e7a0307e0f04b07a5c0889fb325b993",
    "objaverse_000-011_217ecd30faa54f20b03d8f0ad9ece9ee",
    "objaverse_000-012_44de9112ce564d35be97a06c302a2fe3",
    "objaverse_000-000_0048e8224b174b759771e39ff521ee2",
    "objaverse_000-000_019900af7ef14e07b66c3e74aec43d35",
    "objaverse_000-000_56d3182919494dd0b6a773f563ced14a",
    "objaverse_000-000_6eb1fbba00bf4317b3e82824a42b840e",
    "objaverse_000-002_0aecee43ac2749499a16ab4388a0baa2",
]

methods = ['gt', 'ours_1024', 'ours_512', 'dora', 'trellis']
names = ['GT Mesh', 'Ours (1024)', 'Ours (512)', 'Dora', 'Trellis']

attributes = []
for m, n in zip(methods, names):
    attributes.append({
        'caption': n,
        'mesh_src': f"assets/samples/{m}/{uid_list[0]}.drc",
        'src': f"assets/videos/{m}/{uid_list[0]}.mp4"
    })

for uid in uid_list[1:]:
    for m in methods:
        attributes.append({
            'mesh_src': f"assets/samples/{m}/{uid}.drc",
            'src': f"assets/videos/{m}/{uid}.mp4"
        })

print(
    'var videosAttributes = ' + str(attributes) + ';'
)